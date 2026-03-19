import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        // For local development, proxy to local backend
        // target: 'http://localhost:8085', 
        // For production or staging, proxy to the actual backend server
        target: 'https://blogapi.grummans.me',
        changeOrigin: true,
        secure: false,
        // Don't rewrite - backend already expects /api prefix
      }
    }
  }
})
