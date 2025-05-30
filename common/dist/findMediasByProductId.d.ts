import { Connection } from "mysql2/promise";
export declare function findMediasByProductId(connection: Connection, product_id: string): Promise<any>;
