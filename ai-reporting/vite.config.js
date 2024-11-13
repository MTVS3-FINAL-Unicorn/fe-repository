import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 904,
    host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1/report'),
        },
      },
  },
  plugins: [react()],
})
