import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import axios, {AxiosError} from "axios";

export class StorageService {
    private readonly s3Client
    private readonly bucketName: string
    private readonly awsHost: string

    constructor() {
        this.s3Client = new S3Client({
            region: `${import.meta.env.VITE_AWS_REGION}`,
            credentials: {
                accessKeyId: `${import.meta.env.VITE_AWS_ACCESS_KEY}`,
                secretAccessKey: `${import.meta.env.VITE_AWS_SECRET_KEY}`
            } });
        this.bucketName = `${import.meta.env.VITE_AWS_S3_BUCKET_NAME}`
        this.awsHost = `${import.meta.env.VITE_AWS_HOST}`
    }

    async upload(file: File, folder: string, filename?: string) {
        let destination;
        if(!filename) {
            destination = `${folder}/input/${file.name}`;
        } else {
            destination = `${folder}/input/${filename}.png`; // todo: change extension
        }

        const uploadParams = {
            Bucket: this.bucketName,
            Key: destination,
            Body: file
        };

        return this.s3Client.send(new PutObjectCommand(uploadParams));
    }

    getFile(folder: string, filename: string) {
        return this.awsHost + folder + '/output/' + filename;
    }

    // async getFileFromS3Url(s3Url: string): Promise<File> {
    //     try {
    //         const response = await axios.get(s3Url, { responseType: 'blob'});
    //         const urlSegments = s3Url.split('/');
    //         const fileName = urlSegments[urlSegments.length - 1];
    //         return new File([response.data], fileName, {type: response.data.type});
    //     } catch (error) {
    //         console.error("Erreur lors de la récupération du fichier:", error);
    //         throw new Error("Impossible de récupérer le fichier.");
    //     }
    // }

    async getFileFromS3Url(s3Url: string): Promise<File> {
        const maxRetryAttempts = 5; // Nombre maximal de tentatives
        let attempt = 0;

        while (attempt < maxRetryAttempts) {
            try {
                attempt++;
                console.log(`Tentative ${attempt} de récupération du fichier à partir de l'URL S3: ${s3Url}`);

                const response = await axios.get(s3Url, { responseType: 'blob' });

                const urlSegments = s3Url.split('/');
                const fileName = urlSegments[urlSegments.length - 1];

                return new File([response.data], fileName, {type: response.data.type});
            } catch (error) {
                const axiosError = error as AxiosError;
                const isLastAttempt = attempt === maxRetryAttempts;

                if (axiosError.response) {
                    // console.error(`Erreur HTTP lors de la récupération du fichier: ${axiosError.message}`);
                    if (isLastAttempt) {
                        // console.error(`Maximum de tentatives atteint. Impossible de récupérer le fichier.`);
                        throw new Error("Impossible de récupérer le fichier.");
                    } else {
                        console.log(`Réessayer dans quelques instants...`);
                    }
                } else {
                    // console.error(`Erreur lors de la récupération du fichier: ${axiosError.message}`);
                    if (isLastAttempt) {
                        // console.error(`Maximum de tentatives atteint. Impossible de récupérer le fichier.`);
                        throw new Error("Impossible de récupérer le fichier.");
                    } else {
                        console.log(`Réessayer dans quelques instants...`);
                    }
                }

                // Attendre avant la prochaine tentative (par exemple, 2 secondes)
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        throw new Error("Maximum de tentatives atteint. Impossible de récupérer le fichier.");
    }
}