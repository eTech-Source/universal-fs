import {defineWorkspace} from "vitest/config";

export default defineWorkspace([
  "src/tests/*",
  {
    extends: "./vite.config.ts",
    test: {
      include: [
        "src/tests/client/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
      ],
      name: "happy-dom",
      environment: "happy-dom"
    }
  },
  {
    extends: "./vite.config.ts",
    test: {
      include: [
        "src/tests/server/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
      ],
      name: "server",
      environment: "node"
    }
  }
]);
