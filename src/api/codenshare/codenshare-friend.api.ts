import {request} from "@/api/codenshare";
import {Friend, UserId} from "@/models";

export class CodeNShareFriendApi {
    static async getFollowersByUser(userId: UserId): Promise<Friend[]> {
        return request<Friend[]>({method: 'GET', url: `/friends/followers?userId=${userId}`})
    }

    static async getFollowingByUser(userId: UserId): Promise<Friend[]> {
        return request<Friend[]>({method: 'GET', url: `/friends/following?userId=${userId}`})
    }

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