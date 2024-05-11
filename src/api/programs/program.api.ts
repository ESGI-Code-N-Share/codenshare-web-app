export class ProgramApi {
    // codeHistory: CodeHistoryApi;
    readonly BASE_URL = `${import.meta.env.VITE_API_URL}/programs`

    constructor() {
    }

    async create(): Promise<{ programId: string }> {
        try {
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json() as { programId: string };
            if (!response.ok) {
                throw new Error("Failed to create program");
            }
            return data;
        } catch (e) {
            console.error(e);
            throw new Error('Failed to create program');
        }
    }

    async list(): Promise<{ data: { programId: string }[] }> {
        try {
            const response = await fetch(this.BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to list programs");
            }
            return data;
        } catch (e) {
            console.error(e);
            throw new Error('Failed to list programs');
        }
    }

    async find(programId: string): Promise<{
        program: {
            programId: string,
            language: string,
            name: string,
            description: string,
            visibility: 'public' | 'private' | 'protected',
            code: string,
            image: string,
        }
    }> {
        try {
            const response = await fetch(`${this.BASE_URL}/${programId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to find program");
            }
            return data;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Error('Service unavailable');
            }
            throw new Error('Failed to find program');
        }
    }

    async update(programId: string, program: {
        language: { value: string, label: string },
        name: string,
        description: string,
        share: boolean,
        code: string,
        image: string,
    }): Promise<void> {
        try {
            const body = {
                language: program.language?.value || '',
                name: program.name,
                description: program.description,
                visibility: program.share ? 'public' : 'private',
                code: program.code,
                pictureName: program.image,
            }
            const response = await fetch(`${this.BASE_URL}/${programId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(body)
            });
            console.log("response: ", response);
            if (!response.ok) {
                throw new Error("Failed to update program");
            }
        } catch (e) {
            console.error(e);
            throw new Error('Failed to update program');
        }
    }

    async delete(programId: string): Promise<void> {
        try {
            const response = await fetch(`${this.BASE_URL}/${programId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to delete program");
            }
        } catch (e) {
            console.error(e);
            throw new Error('Failed to delete program');
        }
    }

    async run(programId: string, instructions: {}, files: File[], mode: 'debug' | 'run' = 'run') {
        try {
            const formData = new FormData();
            formData.append('instructions', JSON.stringify(instructions));
            files.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });

            const response = await fetch(`${this.BASE_URL}/${programId}/run?mode=${mode}`, {
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to run program in ${mode} mode`);
            }
        } catch (e) {
            console.error(e);
            throw new Error(`Failed to run program in ${mode} mode`);
        }
    }
}