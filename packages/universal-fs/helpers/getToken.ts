import {isBrowser, isNode} from "browser-or-node";
import getCookie from "./getCookie";

const getToken = async () => {
  if (isBrowser) {
    return getCookie("universal-fs-token");
  } else if (isNode) {
    const fs = await import("fs");
    return fs.readFileSync(".fs/token.txt", "utf8");
  }
};

export default getToken;
