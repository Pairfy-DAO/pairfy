import { Connection, RowDataPacket } from "mysql2/promise";

/**ENCRYPTED*/
export async function findUserPrivateKey(
  connection: Connection,
  id: string
): Promise<any> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT rsa_private_key FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows?.[0]?.rsa_private_key || null
}
