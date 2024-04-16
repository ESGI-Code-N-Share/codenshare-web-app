import {Auth, signInWithEmailAndPassword,GoogleAuthProvider, GithubAuthProvider, signInWithPopup, } from 'firebase/auth';
import {getFirebase} from "@/services/firebase.service";
import {ErrorMessage} from "@/services/error.message";
import {ApiInterface} from "@/api/codenhare.api.interface";
import {CodenShareApi} from "@/api/codenhare.api";
import {FirebaseErrorMessage} from "@/services/firebase.error.message";

export class AuthService {
    auth: Auth
    api: ApiInterface

    constructor() {
        this.auth = getFirebase.auth;
        this.api = new CodenShareApi() // fixme
    }

    async signIn(email: string, password: string) {
        await signInWithEmailAndPassword(this.auth, email, password).catch((error) => {throw new Error(ErrorMessage.INVALID_CREDENTIALS)})
        const token = await this.auth.currentUser?.getIdToken(true);
        if(token) {
            console.log(token)
            await this.api.login(token).catch(() => {
                throw new Error(ErrorMessage.INVALID_CONNECTION)
            });
        }
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(this.auth, provider);

        const token = await credential.user.getIdToken(true);

        console.log(token)
        console.log(credential.user)

        // if(token) {
        //     await this.api.login(token).catch(() => new Error(ErrorMessage.INVALID_CONNECTION));
        // }
    }

    async signInWithGithub() {
        const provider = new GithubAuthProvider();
        const credential = await signInWithPopup(this.auth, provider);
        const token = await credential.user.getIdToken(true);
        console.log(token)
        // if(token) {
        //     await this.api.login(token).catch(() => new Error(ErrorMessage.INVALID_CONNECTION));
        // }
    }

    async register(firstname: string, lastname: string, email: string, password: string) {
        if(!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
            throw new Error(ErrorMessage.INVALID_INFORMATIONS);
        }
        await this.api.register({firstname, lastname, email, password}).catch((error) => {
            // fixme : other way handle error ?
            if(error.message == FirebaseErrorMessage.EMAIL_ALREADY_EXISTS) {
                throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
            }

            if(error.message == FirebaseErrorMessage.INVALID_EMAIL) {
                console.error(ErrorMessage.INVALID_EMAIL)
            }

            if(error.message == ErrorMessage.INVALID_INFORMATIONS) {
                console.error(ErrorMessage.INVALID_INFORMATIONS)
            }

            if(error.message == FirebaseErrorMessage.INVALID_PASSWORD) {
                console.error(ErrorMessage.INVALID_INFORMATIONS)
            }
        })
    }
    //
    // async resetPassword(email: string) {
    //     if(!email.trim()) {
    //         throw new Error(ErrorMessage.INVALID_EMAIL);
    //     }
    //     await this.api.resetPassword(email)
    // }
}