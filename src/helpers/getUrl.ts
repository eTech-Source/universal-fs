import {isBrowser, isNode} from "browser-or-node";
import getCookie from "./getCookie";

const getUrl = async () => {
  let url;
  if (isBrowser) {
    url = getCookie("universal-fs-url");
  } else if (isNode) {
    const fs = await import("fs");
    url = fs.readFileSync(".fs/url.txt", "utf8");
  }
  return url;
};

export default getUrl;
