import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          'router-vendor': ['react-router-dom']
        }
      }
    },
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false
  },
  define: {
    'process.env': {}
  }
})