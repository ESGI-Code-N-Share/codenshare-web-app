import {request} from "@/api/media";


export class MediaApi {
    static async uploadFile(file: File) {
        return request({
            method: 'POST',
            url: '/upload',
            body: {file}
        })
    }

    static async getFile(filename: string) {
        return request({method: 'GET', url: `/${filename}`})
            .then(response => response.imageURL)
    }
}