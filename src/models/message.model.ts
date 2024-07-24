import {ConversationId, User} from "@/models";


export type MessageId = string

export interface Message {
    messageId: MessageId
    content: string
    conversationId: ConversationId
    image?: string
    sender: User
    sendAt: Date
}