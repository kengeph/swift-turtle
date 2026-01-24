import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for InfinityFree hosting
  build: {
    outDir: '../docs/couplegames',
  },
})
