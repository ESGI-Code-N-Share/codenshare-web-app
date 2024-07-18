/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_MEDIA_URL: string;

    // server socket env
    readonly VITE_SERVER_SOCKET: string;

    // S3 env
    readonly VITE_AWS_HOST: string;
    readonly VITE_AWS_ACCESS_KEY: string;
    readonly VITE_AWS_SECRET_KEY: string;
    readonly VITE_AWS_S3_BUCKET_NAME: string;
    readonly VITE_AWS_REGION: string;
}