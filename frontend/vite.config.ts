import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 50000,
  },

  define: {
    'process.env': {}
  },
  server: {
    host: true,
  },
})
