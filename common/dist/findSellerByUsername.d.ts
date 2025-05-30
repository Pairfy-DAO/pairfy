import { Connection } from "mysql2/promise";
export declare function findSellerByUsername(connection: Connection, username: string): Promise<any>;
