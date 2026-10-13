import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pathfinder',
        short_name: 'Pathfinder',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0f766e',
        background_color: '#f8fafc',
      },
      workbox: { globPatterns: ['**/*.{js,css,html,json,svg,png,ico}'] },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
