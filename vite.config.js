import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        background: "src/content-scripts/background.js",
        contentGrailed: "src/content-scripts/grailed.js",
        contentSsense: "src/content-scripts/ssense.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
