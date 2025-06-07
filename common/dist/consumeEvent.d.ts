import { Connection } from "mysql2/promise";
export declare function consumeEvent(connection: Connection, event: any, seq: number): Promise<void>;
