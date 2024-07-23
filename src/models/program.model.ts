import {CodeHistory, UserId} from "@/models";


export type ProgramId = string
export type ProgramLanguages = 'java' | 'javascript' | 'python' | 'rust'| 'ruby'
export type ProgramVisibility = 'public' | 'private' | 'protected'
export type ProgramInstructionsInput = { name: string, type: string }
export type ProgramInstructionsOutput = { name: string, type: string }

export interface ProgramInstructions {
    inputs: ProgramInstructionsInput[]
    outputs: ProgramInstructionsOutput[]
}

export interface ProgramsRequest {
    programId: string
    name: string
    description: string
    language: string
    authorId: UserId
    originalAuthorId: UserId
    imageURL: string
    visibility: string
    createdAt: string
    hasInstructions: boolean
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
    originalAuthorId: UserId
    instructions: ProgramInstructions
    authorName: string
    authorLastName: string
    authorMail: string
    codeHistories: CodeHistory[]
}
