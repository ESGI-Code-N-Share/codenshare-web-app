import {User} from "@/models/index";


export type NotificationId = string
export type NotificationType = 'friendRequest' | 'friendRequestAccepted' | 'message' | 'post'

export interface Notification {
    notificationId: NotificationId;
    user: User;
    message: string;
    type: NotificationType;
    data: Record<string, any>
    read: boolean;
    createdAt: Date;
}