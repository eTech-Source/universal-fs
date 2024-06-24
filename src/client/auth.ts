import {isBrowser, isNode} from "browser-or-node";
import bycrypt from "bcrypt";

const auth = async (password?: string) => {
  if (!process.env.UNIVERSAL_FS_PASSWORD && !password) {
    throw new Error(
      "An environment variable UNIVERSAL_FS_PASSWORD or password prop is required to protect your files"
    );
  }

  if (!password && isBrowser) {
    throw new Error("A password prop is required in browser environments");
  }

  if (isBrowser) {
    const getCookie = (await import("../helpers/getCookie")).default;
    const token = getCookie("UNIVERSAL_FS_TOKEN");
    let hashedPassword;

    if (!token) {
      console.info("No token found, hashing a new one");

      hashedPassword = bycrypt.hashSync(password as string, 10);
      const now = new Date();

      document.cookie = `UNIVERSAL_FS_TOKEN=${hashedPassword}; expires=${now.setDate(now.getDate() + 2 * 7)}`;
    }

    // TODO: add correct url
    const response = await fetch("/", {
      headers: {
        Authorization: `Bearer ${hashedPassword}`
      }
    });

    if (response.status === 401) {
      console.error("Failed to authenticate. Check your password");
    } else if (response.status === 200) {
      console.info("Authenticated");
    } else if (response.status === 500) {
      console.info("Something else went wrong. Check your server logs");
    }
  } else if (isNode) {
    const fs = await import("fs");
    let hashedPassword;

    if (!fs.existsSync(".fs")) {
      fs.mkdirSync(".fs");
      console.info("No cache found. Creating .fs");
    }

    if (!fs.existsSync(".fs/token.txt")) {
      console.info("No token found, hashing a new one");
      hashedPassword = bycrypt.hashSync(
        password || (process.env.UNIVERSAL_FS_PASSWORD as string),
        10
      );

      fs.writeFileSync(".fs/token.txt", hashedPassword);
    }

    // TODO: add correct url
    const response = await fetch("http://localhost:3000/", {
      headers: {
        Authorization: `Bearer ${hashedPassword}`
      }
    });

    if (response.status === 401) {
      console.error("Failed to authenticate. Check your password");
    } else if (response.status === 200) {
      console.info("Authenticated");
    } else if (response.status === 500) {
      console.info("Something else went wrong. Check your server logs");
    }
  }
};

export default auth;
