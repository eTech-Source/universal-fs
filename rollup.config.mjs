import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";
import modify from "rollup-plugin-modify";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "es"
      }
    ],

    inlineDynamicImports: true,
    presserveModules: true,
    plugins: [
      serve({contentBase: "dist"}),
      typescript(),
      modify({
        "dotenv.config()": "dotenv.config({path: '../.env'})",
        ".fs": "../.fs"
      })
    ],
    external: ["express"]
  }
];
