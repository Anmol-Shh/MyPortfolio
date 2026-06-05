import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['ramrod-sarcasm-retinal.ngrok-free.dev']
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor'
            if (id.includes('gsap') || id.includes('framer-motion')) return 'animation-vendor'
            if (id.includes('@tsparticles')) return 'particles-vendor'
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'form-vendor'
          }
        },
      },
    },
  },
})
