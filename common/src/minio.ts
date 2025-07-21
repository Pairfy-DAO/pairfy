import { Client as MinioClient, ClientOptions } from "minio";

export class MinioWrap {
  private _client?: MinioClient;

  get client(): MinioClient {
    if (!this._client) {
      throw new Error("Cannot access the MinIO client before connecting");
    }
    return this._client;
  }

  connect(options: ClientOptions): MinioClient {
    this._client = new MinioClient(options);
    return this.client;
  }
}

