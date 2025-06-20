import { logger } from "@pairfy/common";
import database from "../../database/client.js";

export const updateProductIndex = async (payload: any): Promise<boolean> => {
  let result = false;

  try {
    const document = {
      id: payload.id,
      available: payload.available,
    };
/*
    const response = await searchClient.update({
      index: "products",
      id: document.id,
      doc: document,
    });

    if (response.result !== "updated") {
      throw new Error("UpdateProductIndexError");
    }*/

    result = true;
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

export const updateBook = async (_: any, args: any, context: any) => {
  const params = args.updateBookInput;

  console.log(params);

  const SELLER = context.sellerData;

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

      const updateIndex = await updateProductIndex(payload);

      if (!updateIndex) {
        throw new Error("INTERNAL_ERROR");
      }
    }

    /////////////////////////////////////////////////////////////////

    await connection.commit();

    return { success: true };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const getBooks = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const params = args.getBooksInput;

    const SELLER = context.sellerData;

    const pageSize = 16;

    const defaultCursor = "NOT";

    let queryScheme = `
        SELECT
          p.id AS id,
          p.name AS name,
          p.price AS price,
          p.sku AS sku,
          p.media_url AS media_url,
          p.image_path  AS image_path,
          p.image_set  AS image_set,
          p.discount AS discount,
          p.discount_value AS discount_value,
          p.created_at AS created_at,      
          b.keeping_stock AS book_keeping_stock,
          b.ready_stock AS book_ready_stock,
          b.blocked_stock AS book_blocked_stock
        FROM
          products p
        INNER JOIN
          books b
        ON
          p.id = b.id    
        WHERE
          p.seller_id = ?`;

    let queryParams: any = [SELLER.id];

    if (params.cursor !== defaultCursor) {
      queryScheme += " AND p.created_at < ?";

      const date = new Date(parseInt(params.cursor)).toISOString();

      queryParams.push(date);
    }

    queryScheme += " ORDER BY p.created_at DESC LIMIT ?";

    queryParams.push(pageSize);

    connection = await database.client.getConnection();

    const [products] = await connection.execute(
      "SELECT COUNT(*) AS total FROM products WHERE seller_id = ?",
      [SELLER.id]
    );
    const PRODUCTS = products[0];

    if (PRODUCTS.total < 1) {
      return {
        books: [],
        cursor: params.cursor,
        count: 0,
      };
    }

    const [books] = await connection.query(queryScheme, queryParams);

    const lastBook = books[books.length - 1];

    const cursor = books.length ? lastBook.created_at : params.cursor;

    const count = PRODUCTS.total;

    return {
      books,
      cursor,
      count,
    };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

