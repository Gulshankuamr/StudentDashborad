import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite config
export default defineConfig({
  base: "/", // root domain, ensures assets load correctly
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true, // clean old builds
  },
});