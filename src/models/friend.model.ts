import {User} from "@/models";


export type FriendId = string

export interface Friend {
    friendId: FriendId
    requestedBy: User
    addressedTo: User
    createdAt: Date
}