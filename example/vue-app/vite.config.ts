import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vitePluginChunkName from "vite-plugin-chunk-name";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginChunkName()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
