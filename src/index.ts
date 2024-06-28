import auth from "./client/auth";
import server from "./server/server";
//@ts-ignore
import dotenv from "dotenv";
import initServer from "./server/server";
import {isBrowser, isNode} from "browser-or-node";
import fs from "fs";

dotenv.config({path: ".env"});

/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param url - The url of the relay server
 * @param password - The password to protect the files
 * @async
 */
const init = async (url: string, password?: string) => {
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

  await auth(password);
};

export {init, initServer, auth, server};
