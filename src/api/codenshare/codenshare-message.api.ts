import {request} from "@/api/codenshare";
import {Message} from "@/models/message.model";
import {ConversationId} from "@/models/conversation.model";
import {UserId} from "@/models";

export class CodeNShareMessageApi {
    static async getByConversation(conversationId: ConversationId, userId: UserId): Promise<Message[]> {
        return request({method: 'GET', url: `/users/${userId}/conversations/${conversationId}/messages`})
    }

    static async send(content: string, conversationId: ConversationId, userId: UserId): Promise<Message> {
        return request({
            method: 'POST',
            url: `/users/${userId}/conversations/${conversationId}/messages`,
            body: {content}
        })
    }
}