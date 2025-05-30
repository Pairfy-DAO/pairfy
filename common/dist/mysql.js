"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseWrap = void 0;
const promise_1 = require("mysql2/promise");
class DatabaseWrap {
    get client() {
        if (!this._client) {
            throw new Error("Cannot access the client before connecting");
        }
        return this._client;
    }
    connect(options) {
        this._client = (0, promise_1.createPool)(options);
        return this.client;
    }
}
exports.DatabaseWrap = DatabaseWrap;
