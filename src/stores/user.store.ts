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
        //todo auth: pas de trycatch ici


        async login(email: string, password: string) {
            return CodeNShareAuthApi.login(email, password)
                .then(user => {
                    this.currentUser = user;
                    this.isAuthenticated = true;
                    localStorage.setItem('userId', this.currentUser.userId);
                });
        },
        async register(firstname: string, lastname: string, birthdate: string, email: string, password: string) {
            await CodeNShareAuthApi.register(firstname, lastname, birthdate, email, password);
            this.isAuthenticated = true;
        },
        async logout() {
            // await CodeNShareAuthApi.logout();
            this.currentUser = null;
            this.isAuthenticated = false;
        },

        async fetchUser(userId: UserId) {
            this.loading = true;
            const user = await CodeNShareUserApi.find(userId);
            this.loading = false;
            return user;
        },
    }
});