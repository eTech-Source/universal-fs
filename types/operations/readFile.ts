import fs from "fs";

type ReadFileParams = {
  path: fs.PathOrFileDescriptor;
  options?:
    | {
        encoding?: null | undefined;
        flag?: string | undefined;
      }
    | null
    | undefined;
};

export default ReadFileParams;
