import {CodeHistory, UserId} from "@/models";


export type ProgramId = string
export type ProgramLanguages = 'c' | 'java' | 'javascript'
export type ProgramVisibility = 'public' | 'private' | 'protected'

export interface ProgramsRequest {
    programId: string
    name: string
    description: string
    imageURL: string
    visibility: string
}


export interface Program {
    programId: ProgramId
    name: string
    description: string
    code: string
    imageURL: string
    version?: string
    visibility: ProgramVisibility
    language: ProgramLanguages
    authorId: UserId
    authorName: string
    authorLastName: string
    authorMail: string
    codeHistories: CodeHistory[]
}
