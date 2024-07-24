export type UserId = string
export type UserRole = 'admin' | 'moderator' | 'user'

export interface User {
    userId: UserId
    firstname: string
    lastname: string
    email: string
    birthdate: Date

    avatar: string
    role: UserRole
    overview?: string
    token?: string
    password: string

    createdAt: Date
}