import fs from "fs";

type AccessParams = {
  path: fs.PathLike;
  mode?: number | undefined;
};

export default AccessParams;
