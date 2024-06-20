import {defineConfig} from "vite";

export default defineConfig({
  server: {
    watch: {
      ignored: ["node_modules", "dist"]
    }
  }
});
