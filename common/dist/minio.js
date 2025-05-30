"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioWrap = void 0;
const minio_1 = require("minio");
class MinioWrap {
    get client() {
        if (!this._client) {
            throw new Error("Cannot access the MinIO client before connecting");
        }
        return this._client;
    }
    connect(options) {
        this._client = new minio_1.Client(options);
        return this.client;
    }
}
exports.MinioWrap = MinioWrap;
