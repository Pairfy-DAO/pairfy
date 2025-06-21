import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES, logger } from "@pairfy/common";

export const getBooks = async (_: any, args: any, context: any) => {
  const { cursor, reverseCursor } = args.getBooksInput;
  const { sellerData: SELLER } = context;

  if (cursor && reverseCursor) {
    throw new ApiGraphQLError(400, "Cannot use both cursor and reverseCursor", {
      code: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const pageSize = 16;
  const realLimit = pageSize + 1;

  const queryParams: any[] = [SELLER.id];
  let whereClause = "WHERE seller_id = ?";
  let orderClause = "ORDER BY created_at DESC, id DESC";
  let isReversing = false;

  if (cursor) {
    const [createdAt, id] = cursor.split("_");
    whereClause += " AND (created_at < ? OR (created_at = ? AND id < ?))";
    queryParams.push(createdAt, createdAt, id);
  }

  if (reverseCursor) {
    const [createdAt, id] = reverseCursor.split("_");
    whereClause += " AND (created_at > ? OR (created_at = ? AND id > ?))";
    queryParams.push(createdAt, createdAt, id);
    orderClause = "ORDER BY created_at ASC, id ASC";
    isReversing = true;
  }

  const query = `
    SELECT * FROM books
    ${whereClause}
    ${orderClause}
    LIMIT ?
  `;

  queryParams.push(realLimit);

  let connection = null;

  try {
    connection = await database.client.getConnection();
    const [result] = await connection.query(query, queryParams);

    const hasMore = result.length > pageSize;
    const books = hasMore ? result.slice(0, pageSize) : result;

    let nextCursor: string | null = null;

    if (hasMore) {
      const item = isReversing ? result[pageSize] : books[books.length - 1];
      nextCursor = `${item.created_at}_${item.id}`;
    }

    const finalBooks = isReversing ? books.reverse() : books;

    const [[{ total_books }]] = await connection.query(
      "SELECT COUNT(*) AS total_books FROM books WHERE seller_id = ?",
      [SELLER.id]
    );

    const resultLength = result.length;

    const isAdvancing = !!cursor;

    const isInitialLoad = !cursor && !reverseCursor;

    const hasPrevMore = !isInitialLoad && (
      (!isReversing && (isAdvancing || hasMore)) ||
      (isReversing && hasMore)
    );
    
    const hasNextMore = (
      (!isReversing && hasMore) ||
      (isReversing && (isAdvancing || resultLength > 0))
    );

    return {
      books: finalBooks,
      nextCursor,
      hasPrevMore,
      hasNextMore,
      totalCount: total_books,
    };
  } catch (err) {
    throw new ApiGraphQLError(500, "Unexpected error retrieving books", {
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  } finally {
    if (connection) connection.release();
  }
};
