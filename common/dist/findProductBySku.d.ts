import { Connection } from "mysql2/promise";
export declare function findProductBySku(connection: Connection, seller: string, sku: string): Promise<any>;
