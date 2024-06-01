import {request} from "@/api/codenshare";
import {User, UserId} from "@/models/user.model";


export class CodeNShareUserApi {
    static async search(query: string): Promise<User[]> {
        return request({method: 'GET', url: `/users/search?query=${query}`})
    }

    static async find(userId: UserId): Promise<User> {
        return request({method: 'GET', url: `/users/${userId}`})
    }

    static async delete(userId: UserId): Promise<void> {
        return request({method: 'DELETE', url: `/users/${userId}`})
    }
}