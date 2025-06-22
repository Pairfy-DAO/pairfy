import { Connection, ResultSetHeader } from "mysql2/promise";

export async function deleteBookById(
  connection: Connection,
  id: string
): Promise<ResultSetHeader> {

  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM books WHERE id = ?",
    [id]
  );

  return result;
}
