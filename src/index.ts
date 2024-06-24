import auth from "./client/auth";
//@ts-ignore
import dotenv from "dotenv";
import {exec} from "child_process";

dotenv.config();

const initServer = () => {
  exec("chmod +x run_node_file.sh & ./init.sh");
};

const init = async (password?: string) => {
  await auth(password);
};

export {init, initServer, auth};
