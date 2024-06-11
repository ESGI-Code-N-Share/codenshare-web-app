import {request} from "@/api/codenshare";
import {Post, PostId, PostLikeId} from "@/models/post.model";
import {UserId} from "@/models";


export class CodeNSharePostApi {
    static async getLatestPosts(): Promise<Post[]> {
        return request<Post[]>({method: 'GET', url: '/posts'})
    }

    static async getByUser(userId: UserId): Promise<Post[]> {
        return request<Post[]>({method: 'GET', url: `/posts?userId=${userId}`});
    }

    static async create(title: string, content: string, image?: string): Promise<Post> {
        const body = {title, content, image, authorId: localStorage.getItem('userId')}
        return request({method: 'POST', url: '/posts', body: body})
    }

    static async delete(postId: PostId): Promise<PostId> {
        return request<PostId>({method: 'DELETE', url: `/posts/${postId}`})
    }

    static async like(postId: PostId): Promise<PostLikeId> {
        return request<PostLikeId>({
            method: 'POST',
            url: `/posts/${postId}/likes`,
            body: {userId: localStorage.getItem('userId')}
        })
    }

    static async unlike(postId: PostId): Promise<PostLikeId> {
        return request<PostLikeId>({
            method: 'DELETE',
            url: `/posts/${postId}/likes`,
            body: {userId: localStorage.getItem('userId')}
        })
    }
}