import react from '@vitejs/plugin-react'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
// import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      parseNative: false,
    }),
    // mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
    }),
    // basicSsl(),
    // analyzer(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '@styles',
        replacement: fileURLToPath(new URL('./src/styles', import.meta.url)),
      },
    ],
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //         @import "./src/styles/mixins.scss";
  //       `,
  //     },
  //   },
  // },
  server: {
    host: true,
    // https: false,
    // strictPort: true,
    port: 4320,
    // proxy: {
    //   // Перенаправление запросов с /api на https://api.openai.com/v4
    //   '/api': {
    //     target: 'https://api.openai.com/v4',
    //     changeOrigin: true, // необходимо для виртуального хостинга сайтов с разных доменов
    //     rewrite: path => path.replace(/^\/api/, ''), // удаляем /api из запроса
    //     secure: false, // если вы хотите использовать https для локальной разработки
    //   },
    // },
  },
  envDir: 'env',
  envPrefix: ['VITE_'],
})
