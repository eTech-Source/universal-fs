import auth from "./client/auth";
import server from "./server/server";
import dotenv from "dotenv";

dotenv.config();

const init = async (password?: string) => {
  server();
  await auth(password);
};

init();

export {init, auth};
