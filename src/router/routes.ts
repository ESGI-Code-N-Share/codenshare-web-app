import {RouteRecordRaw} from "vue-router";
import HomePage from "@/views/HomePage.vue";
import MainLayout from "@/layouts/MainLayout.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/app/home"
    },
    {
        path: "/app",
        redirect: "/app/home",
        component: MainLayout,
        children: [
            {
                path: "home",
                name: "home",
                component: HomePage
            },
            // {
            //     path: "profile/:profileId",
            //     name: "profile",
            // },
            {
                path: "programs/:program",
                name: "program",
                component: () => import("@/views/ProgramEditorPage.vue")
            },
            {
                path: "programs",
                name: "programs",
                component: () => import("@/views/ProgramsPage.vue")
            },
            // {
            //     path: "settings",
            //     name: "settings",
            // },
            {
                path: "playground",
                name: "playground",
                component: () => import("@/views/PlaygroundPage.vue")
            },
            // {
            //     path: "user/:id",
            //     name: "user",
            // },
            // {
            //     path: "404",
            //     name: "404",
            //     component: () => import("@/views/NotFoundPage.vue")
            // }
        ]
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
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/app/404"
    }
];

export default routes;