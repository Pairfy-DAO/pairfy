import { Connection } from "mysql2/promise";
export declare function findProductById(connection: Connection, id: string): Promise<any>;
