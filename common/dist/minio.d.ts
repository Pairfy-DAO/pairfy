import { Client as MinioClient, ClientOptions } from "minio";
export declare class MinioWrap {
    private _client?;
    get client(): MinioClient;
    connect(options: ClientOptions): MinioClient;
}
