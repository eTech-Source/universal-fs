import fs from "fs";

type ReaddirParams = {
  path: fs.PathLike;
  options?:
    | {
        encoding: BufferEncoding | null;
        withFileTypes?: false | undefined;
        recursive?: boolean | undefined;
      }
    | BufferEncoding
    | null
    | undefined;
};

export default ReaddirParams;
