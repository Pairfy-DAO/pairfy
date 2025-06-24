import { Connection, RowDataPacket } from "mysql2/promise";

export async function findBookBySeller(
  connection: Connection,
  id: string,
  sellerId: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM books WHERE id = ? AND seller_id = ? LIMIT 1`,
    [id, sellerId]
  );

  return rows?.[0] || null
}
