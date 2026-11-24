import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000'

const commonProxy = {
  '/api':          { target: backendTarget, changeOrigin: true, secure: false },
  '/messages':     { target: backendTarget, changeOrigin: true, secure: false },
  '/chatlogs':     { target: backendTarget, changeOrigin: true, secure: false },
  '/chat-logs':    { target: backendTarget, changeOrigin: true, secure: false },
  '/appointments': { target: backendTarget, changeOrigin: true, secure: false },
  '/reviews':      { target: backendTarget, changeOrigin: true, secure: false },
  '/content':      { target: backendTarget, changeOrigin: true, secure: false },
  '/stats':        { target: backendTarget, changeOrigin: true, secure: false },
  '/auth':         { target: backendTarget, changeOrigin: true, secure: false },
  '/login':        { target: backendTarget, changeOrigin: true, secure: false },
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: commonProxy
  },
  preview: {
    port: 4173,
    host: true,
    proxy: commonProxy
  }
})
