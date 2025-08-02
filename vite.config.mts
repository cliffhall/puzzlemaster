// vite.config.js
import { defineConfig } from "vitest/config";
import { resolve } from "path";

// Fix for PureMVC ESM module resolution in tests
// The issue was that Vitest couldn't resolve the relative imports within the PureMVC package
// By using deps.inline, we tell Vitest to inline the PureMVC package during testing
// This allows the relative imports to be resolved correctly
// Note: deps.inline is deprecated, but it works for our specific case
export default defineConfig({
  resolve: {
    alias: {
      "@puremvc/puremvc-typescript-multicore-framework": resolve(
        __dirname,
        "node_modules/@puremvc/puremvc-typescript-multicore-framework/bin/esm",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
    deps: {
      inline: [/@puremvc\/puremvc-typescript-multicore-framework/],
    },
  },
});
