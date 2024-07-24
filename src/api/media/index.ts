export * from './media.api';


export type RequestMethod = 'GET' | 'POST'

export interface Request {
    method: RequestMethod;
    url: string;
    body?: any;
}

export interface Response {
    message: string
    file: File
    imageURL: string
}

export const request = async ({method, url, body}: Request) => {
    const baseUrl = `${import.meta.env.VITE_MEDIA_URL}`;

    const formData = new FormData();
    formData.append('file', body.file);

    const response = await fetch(`${baseUrl}${url}`, {
        method,
        mode: 'cors',
        body: formData,
    });
    if (!response.ok) {
        const result = await response.text();
        throw new Error(result);
    }

    const responseData = await response.text();
    return JSON.parse(responseData) as Response;
}