import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('@supabase')) return 'supabase';
        },
      },
    },
  },
})
