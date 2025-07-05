import { Connection } from "mysql2/promise";


export async function insertNotification(
  connection: Connection,
  scheme: any
): Promise<any> {

  const columns = Object.keys(scheme);

  const values = Object.values(scheme);

  const query = `
    INSERT INTO notifications (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;

  return await connection.execute(query, values);
}
