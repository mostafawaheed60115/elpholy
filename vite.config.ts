import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/public/stores': {
        target: 'https://stores.nova-solution.net',
        changeOrigin: true,
      },
      '/stores': {
        target: 'https://stores.nova-solution.net',
        changeOrigin: true,
      }
    }
  }
})

