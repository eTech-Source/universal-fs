import bycrypt from "bcrypt";
import express from "express";
import fs from "fs";
import isJson from "../helpers/isJson";

const server = () => {
  const app = express();
  const port = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
    if (!process.env.UNIVERSAL_FS_PASSWORD) {
      throw new Error(
        "An environment variable UNIVERSAL_FS_PASSWORD is required to protect your files"
      );
    }

    if (!req.headers.authorization) {
      return res
        .json({success: false, error: "An Authorization header is required"})
        .status(401);
    }

    if (
      !bycrypt.compareSync(
        process.env.UNIVERSAL_FS_PASSWORD,
        (req.headers.authorization as string).replace(/^Bearer\s/, "")
      )
    ) {
      return res
        .json({success: false, error: "Unauthorized request"})
        .status(401);
    }

    next();
  });

  app.use((req, res, next) => {
    if (!req.query.method || req.query.method === "") {
      return res.json({error: "A method is required"}).status(422);
    }

    if (req.method === "POST" && !req.body) {
      return res
        .json({error: "A body is required on post requests"})
        .status(422);
    }
    next();
  });

  app.get("/:path", async (req, res) => {
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
          return res.json({success: false, error: err}).status(500);
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
          return res.json({success: false, error: err}).status(500);
        }
      default:
        // This should never trigger because of the first check
        return res.json({error: "Method not found"}).status(422);
    }
  });

  app.post("/:path", (req, res) => {
    switch (req.query.method) {
      case "writeFile":
        let writeOptions: fs.WriteFileOptions | undefined;
        if (isJson(req.headers.options as string)) {
          writeOptions = JSON.parse(req.headers.options as string);
        }

        try {
          fs.writeFileSync(req.params.path, req.body.contents);
          return res.json({success: true, message: "File written"});
        } catch (err: any) {
          return res.json({success: false, error: err}).status(500);
        }
      case "mkdir":
        let mkdirOptions:
          | (fs.MakeDirectoryOptions & {
              recursive?: false | undefined;
            })
          | null = null;

        if (isJson(req.headers.options as string)) {
          mkdirOptions = JSON.parse(req.headers.options as string);
        }

        try {
          fs.mkdirSync(req.params.path, mkdirOptions);
          return res.json({success: true, message: "Directory created"});
        } catch (err: any) {
          return res.json({success: false, error: err}).status(500);
        }

      default:
        return res.json({error: "Method not found"}).status(422);
    }
  });

  app.delete("/:path", (req, res) => {
    switch (req.query.method) {
      case "unlink":
        try {
          fs.unlinkSync(req.params.path);
          return res.json({success: true, message: "File deleted"});
        } catch (err: any) {
          return res.json({success: false, error: err}).status(500);
        }
      case "rmdir":
        let rmOptions: fs.RmOptions | undefined = undefined;

        if (isJson(req.headers.options as string)) {
          rmOptions = JSON.parse(req.headers.options as string);
        }

        try {
          fs.rmdirSync(req.params.path, rmOptions);
          return res.json({success: true, message: "Directory deleted"});
        } catch (err: any) {
          return res.json({success: false, error: err}).status(500);
        }
      default:
        return res.json({error: "Method not found"}).status(422);
    }
  });

  app.listen(port, () => {
    console.info(`Example app listening on port ${port}`);
  });
};

export default server;
