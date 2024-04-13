import {RouteRecordRaw} from "vue-router";
import HomePage from "@/views/HomePage.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        name: "home",
        component: HomePage
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginPage.vue")
    },
    {
        path: "/sign-up",
        name: "sign-up",
        component: () => import("@/views/SignUpPage.vue")
    },
];

export default routes;