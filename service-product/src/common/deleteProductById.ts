import { Connection, ResultSetHeader } from "mysql2/promise";

export async function deleteProductById(
  connection: Connection,
  id: string,
  schema_v: number
): Promise<ResultSetHeader> {
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("Product ID must be a non-empty string.");
  }
  
  if (!Number.isInteger(schema_v)) {
    throw new Error("schema_v must be a valid integer.");
  }

  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ? AND schema_v = ?",
    [id, schema_v]
  );

  return result;
}
