import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'portal-dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 50000,
    rollupOptions: {
      input: 'portal.html',
    },
  },
  define: {
    'process.env': {},
  },
});
