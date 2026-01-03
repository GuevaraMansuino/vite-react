import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// const TARGET = 'https://final2025python-gero.onrender.com';
// Apunta al backend local. Si tu Docker corre en el puerto 800, cambia 8000 por 800.
//http://localhost:8000
const TARGET = 'https://final2025python-gero.onrender.com';

/**
 * Creates a consistent proxy configuration for Vite dev server
 * @param {string} name - The name identifier for the proxy configuration
 * @returns {Object} Proxy configuration object
 */
const createProxyConfig = (name) => ({
  target: TARGET,
  changeOrigin: true,
  secure: false,
  followRedirects: true, // Follow redirects internally
  // Don't rewrite paths - let them pass through as-is to the backend
  rewrite: (path) => path,
  configure: (proxy, _options) => {
    proxy.on('error', (err, _req, _res) => {
      console.error(`${name} proxy error:`, err);
    });
    proxy.on('proxyReq', (proxyReq, req, _res) => {
      // Set Origin to match target to pass backend CSRF/CORS checks
      proxyReq.setHeader('Origin', TARGET);
    });
    proxy.on('proxyRes', (proxyRes, _req, res) => {
      // Add CORS headers to response for the browser
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hook': path.resolve(__dirname, './src/hook'),
      '@api': path.resolve(__dirname, './src/api'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/clients': createProxyConfig('Clients'),
      '/orders': createProxyConfig('Orders'),
      '/products': createProxyConfig('Products'),
      '/addresses': createProxyConfig('Addresses'),
      '/bills': createProxyConfig('Bills'),
      '/order_details': createProxyConfig('OrderDetails'),
      '/reviews': createProxyConfig('Reviews'),
      '/categories': createProxyConfig('Categories'),
      '/cart': createProxyConfig('Cart'),
      '/wishlist': createProxyConfig('Wishlist'),
      '/health_check': createProxyConfig('HealthCheck'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
