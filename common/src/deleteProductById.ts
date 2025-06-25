import { Connection, ResultSetHeader } from "mysql2/promise";

export async function deleteProductById(
  connection: Connection,
  id: string,
  schema_v: number
): Promise<ResultSetHeader> {

  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ? AND schema_v = ?",
    [id, schema_v]
  );

  return result;
}
