import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const buildDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
  },
  server: {
    port: 5173,
  },
})
