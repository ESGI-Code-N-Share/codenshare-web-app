import {createRouter, createWebHistory, NavigationGuard} from "vue-router";
import routes from "./routes";
import {useUserStore} from "@/stores/user.store";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export const onBeforeEach: NavigationGuard = async (to, _, next) => {
    const userStore = useUserStore();

    console.log("--------------------");
    console.log('Checking if user is authenticated');
    console.log('CurrentUser: ', userStore.currentUser)
    console.log('CurrentUser: ', userStore.currentUser)
    console.log('User is authenticated: ', userStore.isAuthenticated)

    // if user is authenticated and trying to access login or register page, redirect to home
    if (userStore.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
        console.log('Redirecting to home')
        return next({name: "home"});
    }

    // if user is not authenticated and trying to access a private page, redirect to login
    const isPublic = to.meta?.public as boolean;
    console.log('Is Public Page: ', isPublic);
    if (!userStore.isAuthenticated && !isPublic) {
        console.log('Redirecting to login')
        return next({name: "login"});
    }

    console.log('Allowing access to page')
    next();
}
router.beforeEach(onBeforeEach);


export default router