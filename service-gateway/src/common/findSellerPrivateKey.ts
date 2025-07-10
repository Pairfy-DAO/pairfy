import { Connection, RowDataPacket } from "mysql2/promise";

/**Find encrypted RSA private key */
export async function findSellerPrivateKey(
  connection: Connection,
  sellerId: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT rsa_private_key FROM sellers WHERE id = ? LIMIT 1`,
    [sellerId]
  );

  return rows?.[0] || null
}
