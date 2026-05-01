import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const buildDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

// Replace __BUILD_DATE__ in dist/sw.js so each deploy gets a unique cache name.
// The SW lives in public/ (must be served at /sw.js for scope) so we can't
// import constants — we string-replace the emitted file instead.
function stampServiceWorker(): Plugin {
  return {
    name: 'tfg-stamp-sw',
    apply: 'build',
    async closeBundle() {
      const swPath = resolve('dist/sw.js')
      const source = await readFile(swPath, 'utf8')
      await writeFile(swPath, source.replaceAll('__BUILD_DATE__', buildDate))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), stampServiceWorker()],
  define: {
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
  },
  server: {
    port: 5173,
  },
})
