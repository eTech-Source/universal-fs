import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "esm",
      },
      { file: "dist/index.cjs", format: "cjs" },
    ],
    plugins: [serve({ contentBase: "dist" }), typescript()],
  },
];
