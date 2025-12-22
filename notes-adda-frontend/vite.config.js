import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Listen on all addresses (0.0.0.0)
    port: 3000,       // Force port 3000
    strictPort: true, // Fail if port is in use
    // REMOVED 'watch' object - it causes loops on Windows native
  }
})