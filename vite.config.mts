// vite.config.js
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@puremvc/puremvc-typescript-multicore-framework": resolve(
        __dirname,
        "node_modules/@puremvc/puremvc-typescript-multicore-framework/bin/esm/index.js",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
  },
});
