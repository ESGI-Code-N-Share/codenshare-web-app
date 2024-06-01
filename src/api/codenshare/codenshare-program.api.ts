import {request} from "@/api/codenshare";
import {Program, ProgramId} from "@/models/program.model";

export class CodeNShareProgramApi {
    static async create() {
        return request({method: 'POST', url: '/program'});
    }

    static async listByUser(): Promise<Program[]> {
        return request({method: 'GET', url: '/program'});
    }

    static async search(query: string): Promise<Program[]> {
        return request({method: 'GET', url: `/program/search?query=${query}`});
    }

    static async get(programId: ProgramId): Promise<Program> {
        return request({method: 'GET', url: `/program/${programId}`});
    }

    static async update(program: Program): Promise<void> {
        return request({method: 'PUT', url: `/program/${program.programId}`, body: program});
    }

    static async delete(programId: ProgramId): Promise<void> {
        return request({method: 'DELETE', url: `/program/${programId}`});
    }

    static async import(programId: ProgramId): Promise<void> {
        return request({method: 'POST', url: `/program/${programId}/import`});
    }

    static async execute(programId: ProgramId): Promise<void> {
        return request({method: 'POST', url: `/program/${programId}/execute`});
    }
}