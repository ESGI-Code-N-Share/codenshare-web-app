import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand
} from "@aws-sdk/client-s3";

import { S3Client } from "@aws-sdk/client-s3";

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

    async upload(file: File, folder: string) {
        const destination = `${folder}/input/${file.name}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: destination,
            Body: file
        };

        try {
            const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
            console.log("File uploaded successfully.", data);
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    }

    async getResult(folder: string) {
        const source = `${folder}/output/`

        const params = {
            Bucket: this.bucketName,
            Prefix: source
        };

        try {
            const command = new ListObjectsV2Command(params);
            // const command = new GetObjectCommand(params);

            const data = await this.s3Client.send(command);
            const outputFiles: string[] = []

            if(data.Contents && data.Contents.length > 0){
                const objectKeys: string[] = data.Contents.map((object) => object.Key) || [];

                for (const key of objectKeys) {
                    if(key != source) {
                        outputFiles.push(this.awsHost + key)
                    }
                }
            }
            return outputFiles[0]; // todo change with Corentin's pipeline, just for 1 to 1
        } catch (err) {
            console.error("Error listing objects:", err);
            throw err;
        }

    }

    async getFile(folder: string, filename: string) {
        return this.awsHost + folder + '/output/' + filename;
    }


}