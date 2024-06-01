import {request} from "@/api/codenshare";
import {Post, PostId} from "@/models/post.model";


export class CodeNSharePostApi {
    static async getLatestPosts(): Promise<Post[]> {
        return request({method: 'GET', url: '/posts'})
    }

    static async create(post: Post): Promise<Post> {
        return request({method: 'POST', url: '/posts', body: post})
    }

    static async delete(postId: PostId): Promise<void> {
        return request({method: 'DELETE', url: `/posts/${postId}`})
    }
}