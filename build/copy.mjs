// @ts-check

import fsp from "fs/promises";

const copyFiles = async () => {
  await fsp.copyFile("package.json", "../../dist/package.json");
};

copyFiles();
