import { Connection } from "mysql2/promise";

export async function countNotifications(
  connection: Connection,
  ownerId: string
): Promise<number> {
  const [rows] = await connection.query(
    "SELECT COUNT(*) AS total_count FROM notifications WHERE owner = ?",
    [ownerId]
  );
  const result = rows as { total_count: number }[];
  return result.length > 0 ? result[0].total_count : 0;
}
