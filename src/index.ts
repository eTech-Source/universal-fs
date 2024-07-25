import auth from "./client/auth";
import dotenv from "dotenv";
import Server from "./server/server";
import {isBrowser, isNode} from "browser-or-node";
import fs from "fs";
import readFile from "./client/operations/readFile/readFile";
import readdir from "./client/operations/readdir/readdir";
import writeFile from "./client/operations/writeFile/writeFile";
import mkdir from "./client/operations/mkdir/mkdir";
import unlink from "./client/operations/unlink/unlink";
import rmdir from "./client/operations/rmdir/rmdir";

dotenv.config({path: ".env"});

/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param url - The url of the relay server
 * @param password - The password to protect the files
 * @async
 */
const init = async (url: string, password?: string, isProtected?: boolean) => {
  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error("Relay server not found");
  }

  if (isBrowser) {
    document.cookie = `universal-fs-url=${url};`;
  } else if (isNode) {
    if (!fs.existsSync(".fs")) {
      console.info("No .fs directory found. Creating .fs directory");
      fs.mkdirSync(".fs");
    }

    fs.writeFileSync(".fs/url.txt", url);
  }

  if (isProtected) {
    await auth(password);
  }
};

export {init, Server, auth, readFile, readdir, writeFile, mkdir, unlink, rmdir};
