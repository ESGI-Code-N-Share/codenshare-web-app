import {ProgramId} from "@/models";


export type CodeHistoryId = string

export interface CodeHistory {
    codeHistoryId: CodeHistoryId;
    code: string;
    program: ProgramId;
    createdAt: Date;
}