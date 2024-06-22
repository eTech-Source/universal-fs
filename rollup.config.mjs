import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "esm"
      }
    ],
    inlineDynamicImports: true,
    plugins: [serve({contentBase: "dist"}), typescript()],
    external: ["express"]
  }
];
