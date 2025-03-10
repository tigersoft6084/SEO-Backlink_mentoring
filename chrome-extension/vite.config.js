import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    ssr: false, // ✅ Disable SSR for Chrome Extension
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"), // Use correct path resolution
        privacy: resolve(__dirname, "public/privacy-policy.html"), // Entry for privacy policy page
        content: resolve(__dirname, "src/content/content.js"), // Include content script
        background: resolve(__dirname, "src/background/background.js") // Include content script
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  },
  publicDir: "public" // Ensures manifest.json and icons are copied
});
