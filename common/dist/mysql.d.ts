import { PoolOptions, Pool } from "mysql2/promise";
export declare class DatabaseWrap {
    private _client?;
    get client(): any;
    connect(options: PoolOptions): Pool;
}
