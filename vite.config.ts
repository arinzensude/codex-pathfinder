import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'emit-catalog',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'catalog.json', source: readFileSync(new URL('./src/data/catalog.json', import.meta.url), 'utf8') })
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg'],
      manifest: {
        id: '/',
        name: 'Pathfinder',
        short_name: 'Pathfinder',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#0f766e',
        background_color: '#f8fafc',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,ico,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
})
