import {request} from "@/api/codenshare";
import {Program, ProgramId, ProgramInstructions, ProgramsRequest} from "@/models/program.model";
import {UserId} from "@/models";

export class CodeNShareProgramApi {
    static async create(): Promise<ProgramId> {
        return request<ProgramId>({
            method: 'POST', url: '/programs', body: {
                authorId: localStorage.getItem('userId'),
            }
        });
    }

    static async getByUser(userId: UserId): Promise<ProgramsRequest[]> {
        return request<ProgramsRequest[]>({
            method: 'GET', url: `/programs?userId=${userId}`
        });
    }

    static async listByUser(): Promise<ProgramsRequest[]> {
        return this.getByUser(localStorage.getItem('userId') as string)
    }

    static async search(query: string): Promise<Program[]> {
        return request<Program[]>({method: 'GET', url: `/programs/search?query=${query}`});
    }

    static async get(programId: ProgramId): Promise<Program> {
        return request<Program>({method: 'GET', url: `/programs/${programId}`});
    }

    static async updateInstructions(programId: ProgramId, instructions: ProgramInstructions): Promise<void> {
        return request<void>({
            method: 'PATCH', url: `/programs/${programId}/instructions`, body: {
                instructions: instructions
            }
        });
    }

    static async update(program: Program): Promise<void> {
        const body = {
            authorId: program.authorId,
            name: program.name,
            description: program.description,
            pictureURL: program.imageURL,
            visibility: program.visibility,
            language: program.language,
            version: program.version || program.language === 'java' ? '11' : 'latest',
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
        const body = {
            userId: localStorage.getItem('userId')
        }
        return request<ProgramId>({method: 'POST', url: `/programs/${programId}/import`, body: body});
    }

    static async run(programId: ProgramId): Promise<string> {
        const body = {
            userId: localStorage.getItem('userId'),
        }
        return request<string>({method: 'POST', url: `/programs/${programId}/run`, body: body});
    }
}