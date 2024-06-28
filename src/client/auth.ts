import {isBrowser} from "browser-or-node";
import bcrypt from "bcrypt";

/**
 * The auth function called in init
 * @param password - The password to protect the files
 * @see init
 * @internal
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

  // TODO: add correct url
  const response = await fetch("http://localhost:3000/", {
    headers: {
      Authorization: `Bearer ${bcrypt.hashSync(password || (process.env.UNIVERSAL_FS_PASSWORD as string), 10)}`
    }
  });

  if (response.status === 401) {
    console.error("Failed to authenticate. Check your password");
  } else if (response.status === 200) {
    console.info("Authenticated");
  } else if (response.status === 500) {
    console.info("Something else went wrong. Check your server logs");
  }
};

export default auth;
