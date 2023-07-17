import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useCounterStore } from './stores/datastore'; 

const app = createApp(App); 
const pinia = createPinia(); 

app.use(pinia).mount('#app');