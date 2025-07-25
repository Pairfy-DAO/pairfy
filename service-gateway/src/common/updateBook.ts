import mysql from "mysql2/promise";

/**Update model without data verification without error handling */ 
export const updateBook = async (
  connection: mysql.Connection,
  id: string,
  schema_v: number,
  data: any
) => {

  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");

  const query = `
    UPDATE books
    SET ${fields}
    WHERE id = ? AND schema_v = ?
    `;

  const [rows] = await connection.execute<mysql.ResultSetHeader>(query, [...Object.values(data), id, schema_v]);

  return rows;
};
