import {User} from "@/domain/models/user.model";

export interface ApiInterface {
    login(token: string): Promise<void>
    register(user: User): Promise<void>
    registerViaOauth(id: string, email: string, lastname: string, firstname: string): Promise<void>
    resetPassword(email: string): Promise<void>
}