//@ts-check

import fs from "fs";

const rmExtra = async () => {
  const extra = ["client", "helpers", "server", "types"];

  for (let i = 0; i < extra.length; i++) {
    if (!fs.existsSync(extra[i])) {
      throw new Error(
        "Could not find directory to remove! Terminating the postinstall script as a safety measure."
      );
    }

    fs.rmdirSync(extra[i], {recursive: true});
  }
};

rmExtra();
