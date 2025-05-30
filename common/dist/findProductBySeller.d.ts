import { Connection } from "mysql2/promise";
export declare function findProductBySeller(connection: Connection, id: string, sellerId: string): Promise<any>;
