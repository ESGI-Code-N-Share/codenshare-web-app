import {CodeHistory, UserId} from "@/models";


export type ProgramId = string
export type ProgramLanguages = 'c' | 'java' | 'javascript'
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
    authorId: UserId
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
    instructions: ProgramInstructions
    authorName: string
    authorLastName: string
    authorMail: string
    codeHistories: CodeHistory[]
}
