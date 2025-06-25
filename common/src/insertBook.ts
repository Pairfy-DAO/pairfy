import { Connection } from "mysql2/promise";


export async function insertBook(
  connection: Connection,
  scheme: any
): Promise<any> {

  const columns = Object.keys(scheme);

  const values = Object.values(scheme);

  const sql = `
    INSERT INTO books (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;

  return await connection.execute(sql, values);
}
