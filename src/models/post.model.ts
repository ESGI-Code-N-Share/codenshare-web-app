import {User} from "@/models/index";


export type PostId = string

export interface Post {
    postId: PostId
    title: string
    content: string
    image?: string
    author: User
    postedAt: Date
}