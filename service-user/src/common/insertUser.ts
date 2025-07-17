import { Connection } from "mysql2/promise";

export async function insertUser(
  connection: Connection,
  scheme: any
): Promise<any> {

  const columns = Object.keys(scheme);

  const values = Object.values(scheme);

  const query = `
    INSERT INTO users (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;

  const [result] = await connection.execute(query, values);

  return result
}
