import { Connection } from "mysql2/promise";
export declare function isProcessedEvent(connection: Connection, id: string): Promise<boolean>;
