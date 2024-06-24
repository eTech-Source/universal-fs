import fs from "fs";
import ReaddirParams from "../../types/operations/readdir";

const readDir = ({path, options}: ReaddirParams) => {
  try {
    return fs.readdirSync(path, options);
  } catch (err: any) {
    throw err;
  }
};

export default readDir;
