import mysql from "mysql2/promise";
/**Update model without data verification without error handling */
export declare const updateSeller: (connection: mysql.Connection, id: string, schema_v: number, data: any) => Promise<mysql.ResultSetHeader>;
