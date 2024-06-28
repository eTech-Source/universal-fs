import auth from "./client/auth";
import server from "./server/server";
//@ts-ignore
import dotenv from "dotenv";
import initServer from "./server/server";

dotenv.config({path: ".env"});

/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param password - The password to protect the files
 * @async
 */
const init = async (password?: string) => {
  await auth(password);
};

initServer();
init();

export {init, initServer, auth, server};
