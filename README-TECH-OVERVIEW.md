# Vite Configuration

To recognize and interpret @ in URL paths:

edit vite.config.ts

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }


To include csv files in build

(see: https://stackoverflow.com/questions/72037842/how-can-i-import-and-use-a-local-csv-file-in-vuejs)

npm i -D @rollup/plugin-dsv

edit vite.config.ts

import dsv from '@rollup/plugin-dsv'

  },  plugins: [vue(), dsv()],


## To publish as GitHub Pages

see: https://mkay11.medium.com/how-to-deploy-your-vite-vue-3-application-in-github-pages-2023-2b842f50576a 



## Vite TS Build configuration

to fix the error at build time:

I have included

 "compilerOptions": {
    "allowJs": true

in event-calendar/tsconfig.vitest.json