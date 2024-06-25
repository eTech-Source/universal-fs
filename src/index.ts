import auth from "./client/auth";
//@ts-ignore
import dotenv from "dotenv";
import {exec} from "child_process";

dotenv.config();

/**
 * Initialize the relay file server. This MUST be called in a Node.js or similar environment
 */
const initServer = () => {
  exec("chmod +x run_node_file.sh & ./init.sh");
};

/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param password - The password to protect the files
 * @async
 */
const init = async (password?: string) => {
  await auth(password);
};

export {init, initServer, auth};
