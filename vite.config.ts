import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/ui"),
      "@data": path.resolve(__dirname, "./src/data"),
    },
  },
  root: "src/ui",
  publicDir: "../../public",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  // Tauriが期待するホスト
  clearScreen: false,
});
