import { Connection } from "mysql2/promise";
export declare function findSellerByEmail(connection: Connection, email: string): Promise<any>;
