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

## Calendar Component (Outlook style): vue-cal

see https://antoniandre.github.io/vue-cal

npm i vue-cal


## Linting and Formatting

https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/

## Internationalization i18n

https://vue-i18n.intlify.dev/guide/introduction.html

good intro: https://blog.logrocket.com/advanced-localization-techniques-vue-js/ 

## Edit an event

Add component EditEventDetails.vue
crucial elements:
<Button label="Submit" @click="submitChanges()" />

import { useEventsStore } from '../stores/datastore';

const store = useEventsStore();

const event = store.eventBeingEdited

function submitChanges() {
  // call store action to update the event
  store.saveChangesInCurrentlyEditedEvent()
}



In router/index.ts add
import EditEventDetails from '../components/EditEventDetails.vue'

    {
      path: '/editEvent',
      name: 'editEvent',
      component: EditEventDetails
    }

In stores/datastore.js add
  in state:    
     eventBeingEdited : ref({})
  under actions

    setupEventForEditing(eventIdToEdit) {
      // find event
      const event = this.eventData.find((event) => event.id == eventIdToEdit )
      // TODO check for event not found
      // clone event and set clone as the event being edited
      this.eventBeingEdited =   ref({ ...event });
    },
    saveChangesInCurrentlyEditedEvent() {
      const event = this.eventData.find((event) => event.id == this.eventBeingEdited.id )
      // update event with properties from eventBeingEdited
      Object.assign(event, this.eventBeingEdited);
      // at this point, the collection this.eventData is updated with the new event details and these are shown in Calendar and List
    }

add in EventDetails.vue:
function goEdit() {
  // invoke on store
  const event = props.event
  store.setupEventForEditing(event.id)
  router.push({ name: 'editEvent' });
}

<button @click="goEdit">Edit Event Details</button>

## add rich text editor

npm install @vueup/vue-quill@latest --save

initialize in main.ts
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

app.component('QuillEditor', QuillEditor);

Use in component:

in <script>: const content = ref('');

in <template>:

  <QuillEditor theme="snow" contentType="html" v-model:content="content" toolbar="full"/>
  <p>Text literal: {{content}}</p>
  <p v-html="content"></p>
