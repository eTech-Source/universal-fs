//@ts-check

import {exec} from "child_process";
import fs from "fs";

if (process.env.CI) {
  console.log("Skipping postinstall script in CI environment.");
  process.exit(0);
}

exec("npm run build");

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
