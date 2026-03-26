import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // If deployed in root domain, base can stay "/"
  // If deployed in subfolder, use "./"
  base: "./",

  server: {
    host: "::", // allows access from local network
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // default output dir for Vite
    emptyOutDir: true, // clean old builds
  },
});