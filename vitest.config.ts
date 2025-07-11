import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __VITEST__: true,
  },
  resolve: {
    extensions: [
      //
      ".vitest.ts",
      ".vitest.tsx",
      ".vitest.js",
      ".vitest.jsx",

      ...[".ts", ".tsx", ".mts", ".mjs", ".jsx", ".js", ".json"],
    ],
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    css: true,
    coverage: {
      include: ["src"],
      exclude: ["**/__tests__/**", "**/*.interface.*"],
    },
  },
});
