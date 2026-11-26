import react from '@vitejs/plugin-react'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // node_modules es una unión hacia dev-deps (fuera de OneDrive): se permite servir desde ahí
  server: { fs: { allow: ['.', join(homedir(), 'dev-deps')] } },
  build: {
    rolldownOptions: {
      output: {
        // Librerías grandes en archivos aparte: el navegador las guarda en caché entre versiones
        codeSplitting: {
          groups: [
            { name: 'supabase', test: /node_modules[\/]@supabase/ },
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|react-router-dom|scheduler)[\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
