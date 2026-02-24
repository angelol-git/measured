import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

// ES modules don't have __dirname, so we create it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    // Use jsdom environment for DOM testing
    environment: "jsdom",

    // Enable globals so you don't need to import describe/it/expect
    globals: true,

    // Setup files to run before tests (for jest-dom matchers)
    setupFiles: ["./vitest.setup.js"],

    // Test file patterns
    include: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      "src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    ],

    // Exclude patterns
    exclude: ["node_modules", "dist"],

    // Enable UI mode support (optional, for npm run test:ui)
    ui: false,

    // Open UI automatically when running vitest --ui
    open: false,

    // Reporter format
    reporter: ["verbose", "dot"],

    // Fail tests that take too long
    testTimeout: 10000,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true,
  },

  // Resolve aliases to match your project structure
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
