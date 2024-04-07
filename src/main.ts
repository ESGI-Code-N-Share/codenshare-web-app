import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

// styles
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/aura-dark-amber/theme.css';
import './style.css'

// icons
import 'primeicons/primeicons.css';

// router
import router from "./router";

import App from './App.vue'
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";

const app = createApp(App)
    // plugins
    .use(PrimeVue, { ripple: true })
    .use(router)

    // components
    .component('Button', Button)
    .component('InputText', InputText)
    .component('Checkbox', Checkbox)


app.mount("#app");





