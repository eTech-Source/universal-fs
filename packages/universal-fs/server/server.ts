import express, {Express} from "express";
import {isBrowser, isNode} from "browser-or-node";
import http from "http";
import dotenv from "dotenv";

/**
 * The universal-fs file relay server controller
 * To start the server see @see Server.init
 * To stop the server see @see Server.stop
 */
export default class Server {
  /**
   * The value of `express()` used to manipulate express before initialization
   */
  private app: Express;

  /**
   * The local port universal-fs is listening on
   * @default 3000
   */
  public port: number = 3000;

  /**
   * Whether or not to forward the port to a remote url
   * Please note this will require an Ngrok account
   */
  private withPortForwarding: boolean = true;

  /**
   * Whether or not the server is protected by a password
   */
  private isProtected: boolean = true;

  /**
   * An optional custom function to use your own Express server
   * @deprecated Use `options.withPortForwarding` instead
   */
  private startServer:
    | ((app: Express, server?: http.Server) => Promise<string> | string)
    | undefined;

  /**
   * An http server storing the value of `this.app.listen()`
   */
  private server!: http.Server;

  /**
   * The universal-fs file relay server
   * @param options Options to customize the server
   */
  constructor(
    options?: {
      /**
       * Whether or not to forward the port to a remote url
       * Please note this will require an Ngrok account
       */
      withPortForwarding?: boolean;
      /**
       * Whether or not the server is protected by a password
       */
      isProtected?: boolean;
      /**
       * The path to your `.env` file
       */
      envPath?: string;
    },
    /**
     * @deprecated Use `options.withPortForwarding` instead. ~~An optional custom function to use your own Express server.~~
     */
    startServer?: (
      app: Express,
      server?: http.Server
    ) => Promise<string> | string
  ) {
    if (!isNode) {
      throw new Error("The server must be initialized on the server side");
    }

    this.app = express();
    this.withPortForwarding = options?.withPortForwarding ?? true;
    this.isProtected = options?.isProtected ?? false;
    this.startServer = startServer ?? undefined;

    if (this.startServer) {
      console.warn(
        "startServer is deprecated, use withPortForwarding instead."
      );
    }

    dotenv.config({path: options?.envPath || ".env"});
  }

  /**
   * Initializes the server and api routes
   * @returns The url to the open Ngrok tunnel or the local port when port forwarding is disabled
   */
  public async init() {
    if (this.isProtected) {
      this.app.use(async (req, res, next) => {
        if (!process.env.UNIVERSAL_FS_PASSWORD) {
          return res.status(401).json({
            success: false,
            error:
              "An environment variable UNIVERSAL_FS_PASSWORD is required to protect your files"
          });
        }

        if (!req.headers.authorization) {
          return res.status(401).json({
            success: false,
            error: "An Authorization header is required"
          });
        }

        const token = req.headers.authorization.replace(/^Bearer\s/, "");

        const bcrypt = await import("bcrypt");

        if (!bcrypt.compareSync(process.env.UNIVERSAL_FS_PASSWORD, token)) {
          return res.status(401).json({
            success: false,
            error: "Unauthorized request"
          });
        }
        next();
      });
    }

    if (this.startServer) {
      this.startServer(this.app, this.server);
    }

    this.port++;
    if (this.port > 3050) {
      console.warn(
        "The server has already tried to start on 50 different ports. It is recommended to open a port in the range of 3000 to 3050 for the best performance."
      );
    }

    if (this.port > 3100) {
      throw new Error(
        "Attempted to start the server on 100 different ports. None were open, aborting."
      );
    }

    try {
      this.server = this.app.listen(this.port);
      this.api();
    } catch (err: any) {
      if (err.code === "EADDRINUSE") {
        this.init();
      }

      throw err;
    }

    let url = `http://localhost:${this.port}`;

    if (this.withPortForwarding) {
      const ngrok = await import("@ngrok/ngrok");

      if (!process.env.NGROK_AUTHTOKEN) {
        throw new Error(
          "Could not find your NGROK_AUTHTOKEN in your environment variables please add it"
        );
      }

      url =
        (
          await ngrok.connect({
            addr: this.port,
            authtoken: process.env.NGROK_AUTHTOKEN
          })
        ).url() || "";

      if (!url) {
        throw new Error("Could not connect to ngrok");
      }

      return url;
    }
  }

  /**
   * An internal method for universal-fs file system methods
   * @param method The type of method eg: "readFile"
   * @param args The arguments for the chosen method
   * @returns The result of the calling the given method
   */
  private async method(method: string, args: unknown[]) {
    const fsp = await import("fs/promises");
    const currentMethods: string[] = [];

    Object.keys(fsp).forEach((method) => {
      currentMethods.push(method);
    });

    Object.keys(fsp.default).forEach((method) => {
      currentMethods.push(method);
    });

    let matchedType = false;

    for (const currentMethod of currentMethods) {
      if (method === currentMethod) {
        matchedType = true;
      }
    }

    if (!matchedType) {
      throw new Error("Invalid method");
    }

    const callMethod = Function(
      `"use strict"; const runMethod = async () => {const {${method}} = await import("fs/promises"); return await ${method}(${JSON.stringify(args).replace("[", "").replace("]", "")});}; return runMethod();`
    );

    const result = await callMethod();
    return result;
  }

  /**
   * An internal method to handle api requests
   */
  private async api() {
    const catMethods = {
      GET: [
        "access",
        "lstat",
        "stat",
        "statfs",
        "readFile",
        "readdir",
        "readlink",
        "realpath",
        "watch",
        "opendir",
        "glob",
        "constants"
      ],
      PUT: [
        "chmod",
        "chown",
        "lchmod",
        "lchown",
        "utimes",
        "lutimes",
        "truncate",
        "writeFile",
        "appendFile"
      ],
      POST: ["mkdir", "mkdtemp", "open", "symlink", "link", "copyFile", "cp"],
      DELETE: ["rmdir", "unlink", "rename"]
    };

    const fsMethod = async (
      // @ts-ignore
      // Just copying types from express
      req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
      // @ts-ignore
      // Just copying types from express
      res: Response<any, Record<string, any>, number>,
      catMethod: string[]
    ) => {
      if (
        typeof req.headers.method !== "string" ||
        typeof req.headers.args !== "string"
      ) {
        return res
          .status(422)
          .json({success: false, error: "Invalid header encoding not found"});
      }

      const method: string = req.headers.method;

      const args = JSON.parse(req.headers.args || "[]");
      let matchedMethod = false;

      for (let i = 0; i < catMethod.length; i++) {
        if (method === catMethod[i]) {
          matchedMethod = true;
          break;
        }
      }

      if (!matchedMethod) {
        return res
          .status(405)
          .json({success: false, error: "Method not allowed"});
      }

      try {
        const data = await this.method(method, args);
        return res.status(200).json({success: true, data});
      } catch (err: any) {
        return res.status(500).json({success: false, error: err});
      }
    };

    this.app.get("/fs", async (req, res) => {
      await fsMethod(req, res, catMethods.GET);
    });

    if (!this.isProtected) {
      this.app.post("/fs", async (req, res) => {
        await fsMethod(req, res, catMethods.POST);
      });

      this.app.put("/fs", async (req, res) => {
        await fsMethod(req, res, catMethods.PUT);
      });

      this.app.delete("/fs", async (req, res) => {
        await fsMethod(req, res, catMethods.DELETE);
      });
    }
  }

  /**
   * Stops the server by closing the current connection.
   */
  public stop() {
    this.server.close();
  }
}
