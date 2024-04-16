import {User} from "@/domain/models/user.model.ts";

export interface ApiInterface {
    login(token: string): Promise<void>
    register(user: User): Promise<void>
    resetPassword(email: string): Promise<string>
}