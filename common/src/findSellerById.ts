import { Connection, RowDataPacket } from "mysql2/promise";

export async function findSellerById(
  connection: Connection,
  id: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM sellers WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows?.[0] || null
}
