import { Client as MinioClient } from "minio";
interface MinioOptions {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
}
export declare class MinioWrap {
    private _client?;
    get client(): MinioClient;
    connect(options: MinioOptions): MinioClient;
}
export {};
