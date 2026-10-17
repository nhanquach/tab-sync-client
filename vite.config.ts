import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "TabSync - Your Tabs Accross Devices",
        short_name: "TabSync",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 48x48 32x32 16x16",
            type: "image/x-icon",
          },
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any",
          },
          {
            src: "maskable-192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "maskable",
          },
          {
            src: "maskable-512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        share_target: {
          action: "/share",
          params: {
            title: "title",
            text: "text",
            url: "url",
          },
        },
        display: "standalone",
        // Loop pastel teal; splash on the light page background.
        theme_color: "#A3E0D2",
        background_color: "#F8F8FA",
      },
    }),
  ],
});
