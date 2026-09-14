import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Sites serves static files from dist/client and the Worker from dist/server.
    outDir: 'dist/client',
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
