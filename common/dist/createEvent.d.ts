import { Connection } from "mysql2/promise";
export declare function createEvent(connection: Connection, timestamp: number, source: string, type: string, data: string, agentId?: string | null): Promise<any>;
