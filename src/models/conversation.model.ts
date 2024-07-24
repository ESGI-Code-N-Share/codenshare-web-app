import {Message, User} from "@/models/index";


export type ConversationId = string

export interface Conversation {
    conversationId: ConversationId
    owner: User
    members: User[]
    messages: Message[]
    createdAt: Date
}