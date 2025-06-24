import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // para simular navegador
    globals: true,
  },
  resolve: {
    alias: {
      '@estilos': path.resolve(__dirname, './src/estilos')
    }
  }
})
