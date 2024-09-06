import auth from "./client/auth";
import Server from "./server/server";
import {isBrowser, isNode} from "browser-or-node";
import fs from "fs";

/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param url - The url of the relay server
 * @param password - The password to protect the files
 * @async
 */
const init = async (url: string, password?: string, isProtected?: boolean) => {
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

export {init, Server, auth};
