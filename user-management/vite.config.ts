import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
      watchFiles: true, // Add this to watch mock file changes
    })
  ],
  server: {
    port: 5173, // Explicitly set port
    cors: true, // Enable CORS
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false
      }
    }
  }
})