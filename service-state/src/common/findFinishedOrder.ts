import { Connection, RowDataPacket } from "mysql2/promise";

export async function findFinishedOrder(
  connection: Connection,
  id: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT finished FROM orders WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows?.[0] || null
}
