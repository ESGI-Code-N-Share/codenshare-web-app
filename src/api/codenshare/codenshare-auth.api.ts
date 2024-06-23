import { request } from "@/api/codenshare";
import {User, UserId} from "@/models";

export class CodeNShareAuthApi {
    static async login(email: string, password: string, stayLogin: boolean): Promise<User> {
        const response = await request<User>({ method: 'POST', url: '/login', body: { email, password, stayLogin } });
        console.log('API response:', response);
        return response
    }

    static async register(firstname: string, lastname: string, birthdate: string, email: string, password: string): Promise<User> {
        return request<User>({ method: 'POST', url: '/register', body: { firstname, lastname, birthdate, email, password } });
    }

    static async logout(userId: UserId): Promise<void> {
        await request<void>({method: 'POST', url: '/logout', body: { userId },
        });
    }
}