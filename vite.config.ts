import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/trpc": {
        target: "http://localhost:4000/trpc",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc/, ""),
      },
      "/ws": {
        target: "ws://localhost:4000/ws",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ""),
        ws: true,
      },
    },
  },
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    outDir: "./dist-frontend",
  },
});
