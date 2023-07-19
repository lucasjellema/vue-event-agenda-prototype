import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'; // https://primevue.org/configuration/
import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

import App from './App.vue'
import router from './router'

import { useCounterStore } from './stores/datastore'; 

const app = createApp(App); 
const pinia = createPinia(); 
app.use(PrimeVue);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Dialog', Dialog);


app.use(pinia).mount('#app');