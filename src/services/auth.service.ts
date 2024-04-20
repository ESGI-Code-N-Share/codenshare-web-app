import {
    Auth,
    getAdditionalUserInfo,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import {getFirebase} from "@/services/firebase.service";
import {ErrorMessage} from "@/services/error.message";
import {CodenShareApi} from "@/api/codenhare.api";

export class AuthService {
    auth: Auth
    api: CodenShareApi

    constructor() {
        this.auth = getFirebase.auth;
        this.api = new CodenShareApi() // fixme
    }

    async signIn(email: string, password: string) {
        await signInWithEmailAndPassword(this.auth, email, password).catch((e) => {
            throw new Error(e.code)
        })
        const token = await this.auth.currentUser?.getIdToken(true);
        if (token) {
            return await this.api.login(token);
        }
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        await this.signInWithProvider(provider)
    }

    async signInWithGithub() {
        const provider = new GithubAuthProvider();
        await this.signInWithProvider(provider)
    }

    private async signInWithProvider(provider: GithubAuthProvider | GoogleAuthProvider) {
        const credential = await signInWithPopup(this.auth, provider);
        const isNewUser = await getAdditionalUserInfo(credential)?.isNewUser as boolean;
        const user = credential.user;

        if (isNewUser) {
            const [firstname, lastname] = user.displayName?.split(' ') as string[];
            return await this.api.registerViaOauth(credential.user.uid, user.email!, lastname, firstname)
        } else {
            const token = await credential.user.getIdToken(true);
            if (token) {
                return await this.api.login(token);
            }
        }
    }


    async register(firstname: string, lastname: string, email: string, password: string) {
        if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
            throw new Error(ErrorMessage.INVALID_INFORMATIONS);
        }
        return await this.api.register({firstname, lastname, email, password});
    }

    async resetPassword(email: string) {
        return await this.api.resetPassword(email)
    }
}