import React from "react";
import {DocsThemeConfig} from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <div style={{display: "flex", gap: "3px"}}>
      <div
        style={{background: "#CB3837", borderRadius: "3px", fontWeight: "bold"}}
      >
        universal-fs
      </div>{" "}
      Docs Beta
    </div>
  ),
  project: {
    link: "https://github.com/eTech-Source/universal-fs/tree/main"
  },
  docsRepositoryBase:
    "https://github.com/eTech-Source/universal-fs/tree/canary/docs"
};

export default config;
