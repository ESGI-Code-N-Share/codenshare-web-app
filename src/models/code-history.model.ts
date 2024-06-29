export type CodeHistoryId = string

export interface CodeHistory {
    codeHistoryId: CodeHistoryId;
    code: string;
    createdAt: Date;
}