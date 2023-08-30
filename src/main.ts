import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'; // https://primevue.org/configuration/
import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputMask from 'primevue/inputmask';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import App from './App.vue'
import i18n from './plugins/i18n'

import { useEventsStore } from './stores/datastore';

const app = createApp(App);
app.use(router)

app.use(i18n)

app.use(PrimeVue);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Tag', Tag);
app.component('Panel', Panel);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('InputMask', InputMask);

app.component('QuillEditor', QuillEditor);

const pinia = createPinia();
app.use(pinia).mount('#app');

