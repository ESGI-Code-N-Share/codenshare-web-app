import {request} from "@/api/codenshare";
import {Post, PostId} from "@/models/post.model";


export class CodeNSharePostApi {
    static async getLatestPosts(): Promise<Post[]> {
        return request<Post[]>({method: 'GET', url: '/posts'})
    }

    static async create(title: string, content: string, image?: string): Promise<Post> {
        const body = {title, content, image, authorId: localStorage.getItem('userId')}
        return request({method: 'POST', url: '/posts', body: body})
    }

    static async delete(postId: PostId): Promise<PostId> {
        return request<PostId>({method: 'DELETE', url: `/posts/${postId}`})
    }
}