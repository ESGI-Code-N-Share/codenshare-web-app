import {request} from "@/api/codenshare";
import {Conversation, ConversationId, UserId} from "@/models";

export class CodeNShareConversationApi {
    static async getByUser(): Promise<Conversation[]> {
        return request({method: 'GET', url: '/conversations'})
    }

    static async create(memberIds: UserId[]): Promise<Conversation> {
        return request({method: 'POST', url: '/conversations', body: {memberIds}})
    }

    static async delete(conversationId: ConversationId): Promise<void> {
        return request({method: 'DELETE', url: `/conversations/${conversationId}`})
    }
}