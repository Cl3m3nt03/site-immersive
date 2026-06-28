import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/site-immersive/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Keep the heavy 3D stack in its own long-cacheable chunk, separate from
        // the sphere component code so revisits don't re-download Three.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('postprocessing') ||
              id.includes('@react-three')
            ) {
              return 'three-vendor'
            }
          }
        },
      },
    },
  },
})
