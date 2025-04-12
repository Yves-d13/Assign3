import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'


export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
  ],

    server: {
      hmr: {
        clientPort: 5173, // Explicitly set HMR port
      },
    },
  })


