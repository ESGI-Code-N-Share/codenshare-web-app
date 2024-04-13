import {Auth, signInWithEmailAndPassword,GoogleAuthProvider, GithubAuthProvider, signInWithPopup, } from 'firebase/auth';
import {getFirebase} from "@/services/firebase.service";
import {AuthenticationApi} from "@/api/auth/authentication-api";
import {ErrorMessage} from "@/services/error.message";

export class AuthService {
    auth: Auth
    authenticationApi: AuthenticationApi

    constructor() {
        this.auth = getFirebase.auth;
        this.authenticationApi = new AuthenticationApi();
    }

    async signIn(email: string, password: string) {
        await signInWithEmailAndPassword(this.auth, email, password);
        const token = await this.auth.currentUser?.getIdToken(true);
        if(token) {
            await this.authenticationApi.login(token).catch(() => new Error(ErrorMessage.INVALID_CONNECTION));
        }
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(this.auth, provider);
        const token = await credential.user.getIdToken(true);
        if(token) {
            await this.authenticationApi.login(token).catch(() => new Error(ErrorMessage.INVALID_CONNECTION));
        }
    }

    async signInWithGithub() {
        const provider = new GithubAuthProvider();
        const credential = await signInWithPopup(this.auth, provider);
        const token = await credential.user.getIdToken(true);
        if(token) {
            await this.authenticationApi.login(token).catch(() => new Error(ErrorMessage.INVALID_CONNECTION));
        }
    }

    async signUp(email: string, password: string) {
        if(!email.trim() || !password.trim()) {
            throw new Error(ErrorMessage.INVALID_INFORMATIONS);
        }
        const link = await this.authenticationApi.signUp({email, password})
        // todo: send a link to mail
        if(!link.trim()) {throw new Error(ErrorMessage.ERROR_LINK_EMAIL_VERIFICATION)}
        return link;
    }

    async resetPassword(email: string) {
        if(!email.trim()) {
            throw new Error(ErrorMessage.INVALID_EMAIL);
        }
        const link = await this.authenticationApi.resetPassword(email)
        // todo: send a link to mail
        if(!link.trim()) {throw new Error(ErrorMessage.ERROR_LINK_RESET_PASSWORD)}
        return link;
    }
}