import { Connection, RowDataPacket } from "mysql2/promise";

export async function findUserById(
  connection: Connection,
  id: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows?.[0] || null
}
