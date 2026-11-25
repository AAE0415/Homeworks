import react from '@vitejs/plugin-react'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // node_modules es una unión hacia dev-deps (fuera de OneDrive): se permite servir desde ahí
  server: { fs: { allow: ['.', join(homedir(), 'dev-deps')] } },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
