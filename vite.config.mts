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
  css: {
    preprocessorOptions: {
      scss: {
        // Optional: Import global SCSS variables or mixins
        // additionalData: `@import "./src/_mantine.scss";`,
      },
    },
  },
  test: {
    globals: true,

    // Route environments by directory to avoid loading Node code in jsdom
    environmentMatchGlobs: [
      ["src/renderer/**", "jsdom"],
      ["src/main/**", "node"],
      ["src/test/**", "node"],
      ["src/domain/**", "node"],
    ],

    // Important for native modules like better-sqlite3/Prisma in Node tests
    pool: "forks",

    setupFiles: "./vitest.setup.mjs",
    deps: {
      inline: [/@puremvc\/puremvc-typescript-multicore-framework/],
    },

    // Ensure Vitest picks up all test files in __tests__ folders
    include: [
      "src/**/__tests__/**/*.test.ts",
      "src/**/__tests__/**/*.test.tsx",
    ],
  },
});
