import react from '@vitejs/plugin-react'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // node_modules es una unión hacia dev-deps (fuera de OneDrive)
  server: { fs: { allow: ['.', join(homedir(), 'dev-deps')] } },
  test: { environment: 'jsdom', include: ['src/**/*.test.js'] },
})
