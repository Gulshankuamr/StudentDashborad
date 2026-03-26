import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: '/', // Root path, ensures assets load correctly
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // alias for src
    },
  },
  server: {
    host: '0.0.0.0', // allow access from network
    port: 3000,      // dev server port
    open: true,      // automatically opens browser
  },
  build: {
    outDir: 'dist',       // production build folder
    emptyOutDir: true,    // clean old builds
    sourcemap: false,     // optional: turn on if debugging production
  },
});