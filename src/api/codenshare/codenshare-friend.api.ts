import {request} from "@/api/codenshare";
import {UserId} from "@/models";

export class CodeNShareFriendApi {
    static async follow(userId: UserId, friendId: UserId): Promise<void> {
        return request({
            method: 'POST', url: `/friends`, body: {
                followerId: userId,
                followedId: friendId
            }
        })
    }

    static async unfollow(userId: UserId, friendId: UserId): Promise<void> {
        return request({
            method: 'DELETE', url: `/friends`, body: {
                followerId: userId,
                followedId: friendId
            }
        })
    }
}