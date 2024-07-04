import bcrypt from "bcrypt";
import express from "express";
import type {Express} from "express";
import fs from "fs";
import isJson from "../helpers/isJson";
import ngrok from "@ngrok/ngrok";
import http from "http";

class Server {
  private app!: Express;
  private port!: number;
  private server!: http.Server;
  constructor() {
    this.app = express();
    this.port = 3000;
  }

  public async init() {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
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

      if (!bcrypt.compareSync(process.env.UNIVERSAL_FS_PASSWORD, token)) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized request"
        });
      }

      next();
    });

    this.app.use((req, res, next) => {
      if (!req.query.method || req.query.method === "") {
        return res.status(422).json({
          error: "A method is required"
        });
      }

      if (req.method === "POST" && !req.body) {
        return res.status(422).json({
          error: "A body is required on post requests"
        });
      }
      next();
    });

    this.app.get("/:path", async (req, res) => {
      switch (req.query.method) {
        case "readFile":
          let fileOptions: {
            encoding?: null | undefined;
            flag?: string | undefined;
          } | null = null;
          let fileBuffer: Buffer | null = null;

          if (isJson(req.headers.options as string)) {
            fileOptions = JSON.parse(req.headers.options as string);
          }

          try {
            fileBuffer = fs.readFileSync(req.params.path, fileOptions);
            return res.json({success: true, buffer: fileBuffer});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }
        case "readdir":
          let dirs: string[] | null = null;
          let dirOptions:
            | BufferEncoding
            | {
                encoding: BufferEncoding | null;
                withFileTypes?: false | undefined;
                recursive?: boolean | undefined;
              }
            | null = null;

          if (isJson(req.headers.options as string)) {
            dirOptions = JSON.parse(req.headers.options as string);
          }

          try {
            dirs = fs.readdirSync(req.params.path, dirOptions);
            return res.json({success: true, dirs: dirs});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }
          break;
        default:
          // This should never trigger because of the first check
          return res.status(422).json({error: "Method not found"});
      }
    });

    this.app.post("/:path", (req, res) => {
      switch (req.query.method) {
        case "writeFile":
          let writeOptions: fs.WriteFileOptions | undefined;
          if (isJson(req.headers.options as string)) {
            writeOptions = JSON.parse(req.headers.options as string);
          }

          try {
            fs.writeFileSync(req.params.path, req.body.contents, writeOptions);
            return res
              .status(200)
              .json({success: true, message: "File written"});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }
        case "mkdir":
          let mkdirOptions:
            | (fs.MakeDirectoryOptions & {recursive?: false | undefined})
            | null = null;

          if (isJson(req.headers.options as string)) {
            mkdirOptions = JSON.parse(req.headers.options as string);
          }

          try {
            fs.mkdirSync(req.params.path, mkdirOptions);
            return res
              .status(200)
              .json({success: true, message: "Directory created"});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }

        default:
          return res.status(422).json({error: "Method not found"});
      }
    });

    this.app.delete("/:path", (req, res) => {
      switch (req.query.method) {
        case "unlink":
          try {
            fs.unlinkSync(req.params.path);
            return res
              .status(200)
              .json({success: true, message: "File deleted"});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }
        case "rmdir":
          let rmOptions: fs.RmOptions | undefined = undefined;

          if (isJson(req.headers.options as string)) {
            rmOptions = JSON.parse(req.headers.options as string);
          }

          try {
            fs.rmdirSync(req.params.path, rmOptions);
            return res
              .status(200)
              .json({success: true, message: "Directory deleted"});
          } catch (err: any) {
            return res.status(500).json({success: false, error: err});
          }
        default:
          return res.status(422).json({error: "Method not found"});
      }
    });

    try {
      this.server = this.app.listen(this.port, () => {
        console.info(`Listening on this.port ${this.port}`);
      });
    } catch (err: any) {
      if (err.code === "EADDRINUSE") {
        console.info(
          `this.port ${this.port} is already in use. Trying to connect on this.port ${this.port++}`
        );
        this.port = this.port++;
      }
    }

    const listener = await ngrok.connect({
      addr: this.port,
      authtoken: process.env.NGROK_AUTHTOKEN
    });

    return listener.url();
  }

  public async stop() {
    this.server.close();
  }
}

export default Server;
