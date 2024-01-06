import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
    workbox: {
        globPatterns: ["**/*"],
        maximumFileSizeToCacheInBytes: 3000000
    },
    includeAssets: [
        "**/*",
    ],
      manifest: {
        short_name: "CityDangersAlert",
        name: "CityDangersAlert App PWA",
        icons: [
          {
            src: "/icons/logo.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#2D4953ff",
        background_color: "#849398ff"
      }
    })
  ],
})
