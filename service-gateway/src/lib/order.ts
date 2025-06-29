import { Connection } from "mysql2/promise";


export async function insertOrder(
  connection: Connection,
  scheme: any
): Promise<any> {

  const columns = Object.keys(scheme);

  const values = Object.values(scheme);

  const sql = `
    INSERT INTO orders (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;

  return await connection.execute(sql, values);
}
