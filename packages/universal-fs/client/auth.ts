import {isBrowser, isNode} from "browser-or-node";
import bcrypt from "bcrypt";
import getCookie from "../helpers/getCookie";

let fs: any;

if (isNode) {
  fs = await import("fs");
}

/**
 * The auth function called in init
 * @param password - The password to protect the files
 * @see {@link init}
 * @internal
 * @async
 */
const auth = async (password?: string) => {
  if (!process.env.UNIVERSAL_FS_PASSWORD && !password) {
    throw new Error(
      "An environment variable UNIVERSAL_FS_PASSWORD or password prop is required to protect your files"
    );
  }

  if (!password && isBrowser) {
    throw new Error("A password prop is required in browser environments");
  }

  let response;

  if (isBrowser) {
    response = await fetch(getCookie("universal-fs-url") || "", {
      headers: {
        Authorization: `Bearer ${bcrypt.hashSync(password || (process.env.UNIVERSAL_FS_PASSWORD as string), 10)}`
      }
    });
  } else if (isNode) {
    response = await fetch(fs.readFileSync(".fs/url.txt", "utf8"), {
      headers: {
        Authorization: `Bearer ${bcrypt.hashSync(password || (process.env.UNIVERSAL_FS_PASSWORD as string), 10)}`
      }
    });
  } else {
    throw new Error("Unsupported environment");
  }

  if (response.status !== 401) {
    console.info("Authenticated");
    if (isBrowser) {
      document.cookie = `universal-fs-token=${bcrypt.hashSync(password || (process.env.UNIVERSAL_FS_PASSWORD as string), 10)};`;
    } else if (isNode) {
      fs.writeFileSync(
        ".fs/token.txt",
        bcrypt.hashSync(
          password || (process.env.UNIVERSAL_FS_PASSWORD as string),
          10
        )
      );
    }
  }
};

export default auth;
