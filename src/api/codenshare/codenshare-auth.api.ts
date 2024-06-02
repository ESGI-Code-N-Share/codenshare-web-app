import {request} from "@/api/codenshare";
import {User} from "@/models";

export class CodeNShareAuthApi {
    static async login(email: string, password: string): Promise<User> {
        return request<User>({method: 'POST', url: '/auth/login', body: {email, password}})
    }

    static async register(/*email: string, password: string*/): Promise<User> {
        return request({method: 'POST', url: '/auth/register', body: {/*email, password*/}})
    }

    static async logout(): Promise<void> {
        return request({method: 'POST', url: '/auth/logout'})
    }
}
