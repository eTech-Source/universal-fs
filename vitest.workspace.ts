import {defineWorkspace} from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "browser tests",
      include: ["**/*.test.ts", "**/*.spec.ts", "**/*.spec.tsx", "setup.ts"],
      exclude: ["**/node/**", "**/node_modules/**"],
      environment: "happy-dom",
      globals: true
    }
  },
  {
    test: {
      name: "node tests",
      include: ["**/*.test.ts", "**/*.spec.ts", "**/*.spec.tsx", "setup.ts"],
      exclude: ["**/browser/**", "**/node_modules/**"],
      environment: "node",
      globals: true
    }
  }
]);
