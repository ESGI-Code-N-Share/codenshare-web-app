import {CodeHistory, User} from "@/models";


export type ProgramId = string
export type ProgramLanguages = 'c' | 'java' | 'javascript'
export type ProgramVisibility = 'public' | 'private' | 'protected'

export interface Program {
    programId: ProgramId
    name: string
    code: string
    description: string
    pictureName: string
    language: ProgramLanguages
    programVisibility: ProgramVisibility
    author: User
    originalAuthor: User
    codeHistories: CodeHistory[]
}
