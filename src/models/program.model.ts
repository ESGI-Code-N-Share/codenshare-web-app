import {CodeHistory, User} from "@/models";


export type ProgramId = string
export type ProgramLanguages = 'c' | 'java' | 'javascript'
export type ProgramVisibility = 'public' | 'private' | 'protected'

export interface Program {
    programId: ProgramId
    name: string
    code: string
    description: string
    imageURL: string
    language: ProgramLanguages
    version: string;
    visibility: ProgramVisibility
    author: User
    originalAuthor: User
    codeHistories: CodeHistory[]
}
