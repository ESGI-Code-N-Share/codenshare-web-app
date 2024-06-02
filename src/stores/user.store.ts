import {defineStore} from "pinia";
import {User, UserId} from "@/models";
import {CodeNShareAuthApi, CodeNShareUserApi} from "@/api/codenshare";


export const useUserStore = defineStore('user', {
    state() {
        return {
            currentUser: null as User | null,
            loading: false,
            error: null as string | null,
            isAuthenticated: false,
        }
    },
    getters: {
        fullName: (state) => `${state.currentUser?.firstname} ${state.currentUser?.lastname}`,
        shortName: (state) => `${state.currentUser?.lastname.charAt(0)}. ${state.currentUser?.firstname}`,
    },
    actions: {
        async login(email: string, password: string) {
            this.loading = true;
            try {
                this.currentUser = await CodeNShareAuthApi.login(email, password);
                this.isAuthenticated = true;
                localStorage.setItem('userId', this.currentUser.userId);
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
        async register() {
            this.loading = true;
            try {
                await CodeNShareAuthApi.register();
                this.isAuthenticated = true;
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            this.loading = true;
            try {
                await CodeNShareAuthApi.logout();
                this.currentUser = null;
                this.isAuthenticated = false;
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        async fetchUser(userId: UserId) {
            this.loading = true;
            const user = await CodeNShareUserApi.find(userId);
            this.loading = false;
            return user;
        },
    }
});