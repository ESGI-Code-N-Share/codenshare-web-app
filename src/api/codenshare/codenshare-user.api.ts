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

    static async update(userId: string, firstname: string, lastname: string, avatar: string, overview: string): Promise<User> {
        return request({
            method: 'PATCH', url: `/users/${userId}`, body: {
                firstname: firstname,
                lastname: lastname,
                avatar: avatar,
                overview: overview
            }
        })
    }
}