//@ts-check

import dotenv from "dotenv";
import {publish} from "libnpmpublish";
import pacote from "pacote";

dotenv.config();

const publishPkg = async (baseBranch, currentBranch, prContents) => {
  if (typeof prContents === "string" && prContents.includes("!skip-publish")) {
    console.log("Skipping publish");
    return;
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const reqHeader = {
    "Authorization": `Bearer ${githubToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Accept": "application/vnd.github+json"
  };

  const basePackageJson = await fetch(
    `https://api.github.com/repos/eTech-Source/universal-fs/contents/packages/universal-fs/package.json?ref=${baseBranch}`,
    {
      headers: reqHeader
    }
  );
  const basePackageJsonData = await basePackageJson.json();

  const currentPackageJson = await fetch(
    `https://api.github.com/repos/eTech-Source/universal-fs/contents/packages/universal-fs/package.json?ref=${currentBranch}`,
    {
      headers: reqHeader
    }
  );
  const currentPackageJsonData = await currentPackageJson.json();

  const baseVersion = JSON.parse(
    Buffer.from(basePackageJsonData.content, "base64").toString("ascii")
  ).version;
  const currentVersion = JSON.parse(
    Buffer.from(currentPackageJsonData.content, "base64").toString("ascii")
  ).version;

  if (currentVersion !== baseVersion) {
    const path = "dist";
    const manifest = await pacote.manifest(path);
    const tarData = await pacote.tarball(path);

    // @ts-ignore
    await publish(manifest, tarData, {
      npmVersion: `universal-fs@${currentVersion}`,
      token: process.env.NPM_TOKEN
    });
  } else {
    console.log("Version has not changed, skipping publish");
  }
};

publishPkg(process.argv[2], process.argv[3], process.argv[4]);
