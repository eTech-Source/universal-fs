import fs from "fs";
import ReadFileParams from "../../types/operations/readFile";

const readFile = ({path, options}: ReadFileParams) => {
  try {
    return fs.readFileSync(path, options);
  } catch (err: any) {
    throw err;
  }
};

export default readFile;
