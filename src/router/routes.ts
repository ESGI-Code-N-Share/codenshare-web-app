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
        path: "/register",
        name: "register",
        component: () => import("@/views/RegisterPage.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginPage.vue")
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("@/views/ResetPasswordPage.vue")
    }
];

export default routes;