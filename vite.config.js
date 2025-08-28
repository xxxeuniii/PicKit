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
      dynamicRoutes: ['/', '/compress', '/crop', '/convert', '/rename'],
      lastmod: '2025-08-28',    // 用固定字符串
      changefreq: 'weekly',
      xmlNs: {
        sitemap: 'http://www.sitemaps.org/schemas/sitemap/0.9' // 保留标准 xmlns
      }
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