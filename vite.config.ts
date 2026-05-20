import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site is served from https://<user>.github.io/iDock2/, so all built
  // asset URLs need to be prefixed with `/iDock2/`. Locally (`npm run dev`)
  // Vite ignores `base` and serves from `/`.
  base: '/iDock2/',
})
