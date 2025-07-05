import mysql from "mysql2/promise";
import { logger } from "@pairfy/common";
import { Connection } from "mysql2/promise";

export const catchError = (error: any) => {
  logger.error(`[EXIT]:${error}`);

  return process.exit(1);
};

export async function findNotifications(
  connection: Connection,
  owner: string,
  limit = 50
) {
  const query = `
    SELECT *
    FROM notifications
    WHERE owner = ?
    ORDER BY created_at ASC
    LIMIT ?
  `;

  const [result] = await connection.query(query, [owner, limit]);

  return result || [];
}

export async function updateNotifications(
  connection: Connection,
  ids: string[],
  owner: string
) {
  if (!ids.length) return;

  const placeholders = ids.map(() => "?").join(", ");
  
  const query = `
    UPDATE notifications
    SET seen = ?
    WHERE id IN (${placeholders}) AND owner = ?
  `;

  const values = [true, ...ids, owner];

  const [result] = await connection.execute<mysql.ResultSetHeader>(query, values);

  return result;
}
