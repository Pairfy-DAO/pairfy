import { Connection } from "mysql2/promise";
export declare function consumedEvent(connection: Connection, event: any, seq: number): Promise<void>;
