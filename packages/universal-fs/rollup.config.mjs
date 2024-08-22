import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "index.ts",
    output: [
      {
        dir: "dist",
        format: "es"
      }
    ],
    inlineDynamicImports: true,
    presserveModules: true,
    plugins: [
      typescript({
        tsconfig: "../../tsconfig.json",
        abortOnError: false,
        check: false
      }),
      copy({targets: [{src: "types/fs.d.ts", dest: "dist"}]})
    ],
    external: ["express", "bcrypt", "browser-or-node", "buffer", "dotenv"]
  }
];
