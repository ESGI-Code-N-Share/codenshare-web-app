import {ProgramId, User} from "@/models/index";


export type PostId = string
export type PostLikeId = string

export interface Like {
    likeId: string
    userId: string
    postId: string
    likedAt: Date
}

export interface Post {
    postId: PostId
    title: string
    content: string
    image?: string
    programId?: ProgramId
    author: User
    likes: Like[]
    postedAt: Date
}