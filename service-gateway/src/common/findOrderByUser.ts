import { Connection, RowDataPacket } from "mysql2/promise";

export async function findOrderByUser(
  connection: Connection,
  orderId: string,
  userId: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM orders WHERE id = ? AND buyer_pubkeyhash = ? LIMIT 1`,
    [orderId, userId]
  );

  return rows?.[0] || null
}
