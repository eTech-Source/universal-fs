//@ts-check

const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const {includeIgnoreFile} = require("@eslint/compat");
const path = require("path");

module.exports = [
  includeIgnoreFile(path.resolve(__dirname, ".gitignore")),
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: typescriptParser
    },
    ignores: [".nx/**"],
    plugins: {
      typescript
    },
    rules: {
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn"
    }
  }
];
