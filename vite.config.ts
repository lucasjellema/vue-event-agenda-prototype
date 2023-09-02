import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dsv from '@rollup/plugin-dsv'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue-event-agenda-prototype/", // to publish on GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        fallback: resolve(__dirname, "404.html")
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dsv(),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: [path.resolve(__dirname, './src/locales/**')],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
