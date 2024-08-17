import {isBrowser, isNode} from "browser-or-node";
import getCookie from "./getCookie";
import fs from "fs";

const getUrlSync = () => {
  let url;
  if (isBrowser) {
    url = getCookie("universal-fs-url");
  } else if (isNode) {
    url = fs.readFileSync(".fs/url.txt", "utf8");
  }
  return url;
};

export default getUrlSync;
