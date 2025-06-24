import database from "../../database/client.js";

export const updateBook = async (_: any, args: any, context: any) => {
  const params = args.updateBookInput;

  console.log(params);

  const { sellerData: SELLER } = context;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    /////////////////////////////////////////////////////////////////

    const [books] = await connection.execute(
      "SELECT ready_stock FROM books WHERE id = ? AND seller_id = ?",
      [params.id, SELLER.id]
    );

    if (books.length < 1) {
      throw new Error("BookExistence");
    }

    const BOOK = books[0];

    const updateScheme = `
            UPDATE books
            SET keeping_stock = ?,
                ready_stock = ?, 
                updated_at = ?,            
                schema_v = schema_v + 1
            WHERE id = ? 
           `;

    const updateValues = [
      params.keeping_stock,
      params.ready_stock,
      Date.now(),
      params.id,
    ];

    const [updated] = await connection.execute(updateScheme, updateValues);

    if (updated.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

    if (BOOK.ready_stock !== params.ready_stock) {
      const payload = {
        id: params.id,
        available: params.ready_stock,
      };
    }

    /////////////////////////////////////////////////////////////////

    await connection.commit();

    return { success: true, message: 'The book has been successfully updated.' };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
