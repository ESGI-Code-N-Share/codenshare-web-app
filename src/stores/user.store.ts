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
    persist: true,
    actions: {
        async login(email: string, password: string, stayLogin: boolean) {
            const user = await CodeNShareAuthApi.login(email, password, stayLogin);
            this.currentUser = user;
            this.isAuthenticated = true;
            localStorage.setItem('userId', user.userId)
            localStorage.setItem('token', user.token!)
        },
        async register(firstname: string, lastname: string, birthdate: string, email: string, password: string) {
            await CodeNShareAuthApi.register(firstname, lastname, birthdate, email, password);
            this.isAuthenticated = true;
        },
        async logout() {
            await CodeNShareAuthApi.logout(this.currentUser!.userId);
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
        },
        async updateUser({firstname, lastname, avatar}: { firstname: string, lastname: string, avatar: string }) {
            if (this.currentUser?.userId)
                this.currentUser = await CodeNShareUserApi.update(this.currentUser?.userId, firstname, lastname, avatar);
        },

        async fetchUser(userId: UserId) {
            this.loading = true;
            const user = await CodeNShareUserApi.find(userId);
            this.loading = false;
            return user;
        },
    }
});