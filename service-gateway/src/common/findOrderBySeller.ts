import { Connection, RowDataPacket } from "mysql2/promise";

export async function findOrderBySeller(
  connection: Connection,
  orderId: string,
  sellerId: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM orders WHERE id = ? AND seller_id = ? LIMIT 1`,
    [orderId, sellerId]
  );

  return rows?.[0] || null
}
