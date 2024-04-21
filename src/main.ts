import {createApp} from 'vue'
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

import ToastService from 'primevue/toastservice';
import Tooltip from "primevue/tooltip";

import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Image from "primevue/image";
import Card from "primevue/card";
import Calendar from "primevue/calendar";
import Password from "primevue/password";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import InlineMessage from "primevue/inlinemessage";
import Divider from "primevue/divider";

// I18n
import {createI18n} from 'vue-i18n'
import fr from "@/locals/fr";

const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr: fr
    },
    legacy: false
});

const app = createApp(App)
    // directives
    .directive('tooltip', Tooltip)

    // plugins
    .use(router)
    .use(PrimeVue, {
        ripple: true,
        inputStyle: "filled",
        pt: {
            tooltip: {
                root: 'text-sm'
            },
            input: {
                root: 'w-full'
            },
            password: {
                input: {
                    root: 'w-full'
                }
            },
            card: {
                body: {
                    style: 'height: 100%'
                },
                content: {
                    style: 'height: 100%'
                }
            }
        }
    })
    .use(ToastService)
    .use(i18n)

    // components
    .component('Button', Button)
    .component('InputText', InputText)
    .component('Calendar', Calendar)
    .component('Checkbox', Checkbox)
    .component('Image', Image)
    .component('Card', Card)
    .component('Password', Password)
    .component('Toast', Toast)
    .component('Dialog', Dialog)
    .component('InlineMessage', InlineMessage)
    .component('Divider', Divider)

app.mount("#app");