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


### add in package.json

```
  "homepage": "https://lucasjellema.github.io/vue-event-agenda-prototype/",
```

and:
```
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
```

That is all it takes!

Open site at homepage URL:

https://lucasjellema.github.io/vue-event-agenda-prototype/

or find link at GitHub Repo, Settings, Pages:

https://github.com/lucasjellema/vue-event-agenda-prototype/settings/pages

### to publish the application:

`npm run deploy``



## Vite TS Build configuration

to fix the error at build time:

I have included

 "compilerOptions": {
    "allowJs": true

in event-calendar/tsconfig.vitest.json

# try rich components - PrimeVue

https://primevue.org/installation/

https://primevue.org/configuration/


npm install primevue

in main.js

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);


DataTable: https://primevue.org/datatable/

