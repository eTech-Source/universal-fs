import AccessParams from "../../types/operations/access";
import fs from "fs";

const access = ({path, mode}: AccessParams) => {
  try {
    fs.accessSync(path, mode);
  } catch (err: any) {
    throw err;
  }
};

export default access;
