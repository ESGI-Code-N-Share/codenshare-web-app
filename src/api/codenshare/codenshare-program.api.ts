import {request} from "@/api/codenshare";
import {Program, ProgramId} from "@/models/program.model";
import {UserId} from "@/models";

export class CodeNShareProgramApi {
    static async create(): Promise<ProgramId> {
        return request<ProgramId>({
            method: 'POST', url: '/programs', body: {
                authorId: localStorage.getItem('userId'),
            }
        });
    }

    static async getByUser(userId: UserId): Promise<Program[]> {
        return request<Program[]>({
            method: 'GET', url: `/programs?userId=${userId}`
        });
    }

    static async listByUser(): Promise<Program[]> {
        return this.getByUser(localStorage.getItem('userId') as string)
    }

    static async search(query: string): Promise<Program[]> {
        return request<Program[]>({method: 'GET', url: `/programs/search?query=${query}`});
    }

    static async get(programId: ProgramId): Promise<Program> {
        return request<Program>({method: 'GET', url: `/programs/${programId}`});
    }

    static async update(program: any): Promise<void> {
        const body = {
            authorId: program.authorId,
            name: program.name,
            description: program.description,
            pictureURL: program.pictureURL,
            visibility: program.visibility,
            language: program.language,
            code: program.code,
        }
        console.log("body: ", body);
        return request<void>({method: 'PATCH', url: `/programs/${program.programId}`, body: body});
    }

    static async delete(programId: ProgramId): Promise<void> {
        return request({
            method: 'DELETE', url: `/programs/${programId}`, body: {
                userId: localStorage.getItem('userId')
            }
        });
    }

    static async import(programId: ProgramId): Promise<ProgramId> {
        return request<ProgramId>({method: 'POST', url: `/programs/${programId}/import`});
    }

    static async execute(programId: ProgramId): Promise<void> {
        return request({method: 'POST', url: `/programs/${programId}/execute`});
    }
}