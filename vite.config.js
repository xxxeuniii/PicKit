import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import sitemapPlugin from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sitemapPlugin({
      hostname: 'https://pic-kit.vercel.app',
      dynamicRoutes: [
        '/',
        '/compress',
        '/crop',
        '/convert',
        '/rename'
      ],
      lastmod: new Date().toISOString(),
      changefreq: 'weekly'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true
  }
})