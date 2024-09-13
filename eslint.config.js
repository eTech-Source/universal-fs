//@ts-check

import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: [
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      "**/*.ts",
      "**/*.spec.ts"
    ],
    languageOptions: {
      parser: typescriptParser
    },
    plugins: {
      typescript
    },
    rules: {
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn"
    },
    ignores: ["**/node_modules/**", "dist/**", ".github/**"]
  }
];
