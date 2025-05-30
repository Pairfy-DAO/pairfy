import { Connection } from "mysql2/promise";
export declare function findSellerByEmailOrUsername(connection: Connection, email: string, username: string): Promise<any>;
