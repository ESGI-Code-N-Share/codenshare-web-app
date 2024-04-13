import {User} from "@/domain/models/user.model.ts";

export interface AuthenticationApiInterface {
    login(token: string): Promise<void>
    signUp(user: User): Promise<void>
    resetPassword(email: string): Promise<string>
}