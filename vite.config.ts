import {defineConfig} from "vite";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.UNIVERSAL_FS_PASSWORD) {
  throw new Error(
    "Could not get UNIVERSAL_FS_PASSWORD from .env for vite config"
  );
}

export default defineConfig({
  server: {
    watch: {
      ignored: ["node_modules", "dist"]
    }
  },
  test: {
    env: {
      UNIVERSAL_FS_PASSWORD: process.env.UNIVERSAL_FS_PASSWORD
    }
  }
});
