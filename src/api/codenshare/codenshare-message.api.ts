import {request} from "@/api/codenshare";
import {Message} from "@/models/message.model";
import {ConversationId} from "@/models/conversation.model";
import {UserId} from "@/models";

export class CodeNShareMessageApi {
    static async getByConversation(conversationId: ConversationId): Promise<Message[]> {
        const userId = localStorage.getItem('userId')
        return request<Message[]>({method: 'GET', url: `/users/${userId}/conversations/${conversationId}/messages`})
    }

    static async send(content: string, conversationId: ConversationId, userId: UserId, image: string): Promise<Message> {
        return request<Message>({
            method: 'POST',
            url: `/users/${userId}/conversations/${conversationId}/messages`,
            body: {
                content,
                image
            }
        })
    }
}