import {request} from "@/api/codenshare";
import {Conversation, ConversationId, UserId} from "@/models";

export class CodeNShareConversationApi {
    static async getByUser(): Promise<Conversation[]> {
        return request<Conversation[]>({
            method: 'GET',
            url: `/users/${localStorage.getItem('userId')}/conversations`
        })
    }

    static async create(memberIds: UserId[]): Promise<Conversation> {
        return request<Conversation>({
            method: 'POST',
            url: `/users/${localStorage.getItem('userId')}/conversations`,
            body: {memberIds}
        })
    }

    static async delete(conversationId: ConversationId): Promise<void> {
        return request<void>({
            method: 'DELETE',
            url: `/users/${localStorage.getItem('userId')}/conversations/${conversationId}`
        })
    }
}