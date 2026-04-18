import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  },

  build: {
    // Generate source maps only for non-production
    sourcemap: false,

    // Chunk size warning threshold (300KB)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manually split large vendor chunks for better caching
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            return "vendor";
          }
        }
      }
    }
  },

  // Ensure SPA fallback works correctly
  preview: {
    port: 4173
  }
});
