import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES } from "@pairfy/common";
import { verifyParams } from "../../validators/getProducts.js";

export const getProducts = async (_: any, args: any, context: any) => {
  const validation = verifyParams.safeParse(args.getProductsInput);

  if (!validation.success) {
    throw new ApiGraphQLError(400, `Invalid input ${validation.error.format()}`, {
      code: ERROR_CODES.VALIDATION_ERROR
    });
  }

  const { cursor, reverseCursor } = validation.data;
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
    SELECT * FROM products
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
    const products = hasMore ? result.slice(0, pageSize) : result;

    let nextCursor: string | null = null;
    if (hasMore) {
      const item = isReversing ? result[pageSize] : products[products.length - 1];
      nextCursor = `${item.created_at}_${item.id}`;
    }

    const finalProducts = isReversing ? products.reverse() : products;

    const [[{ total_products }]] = await connection.query(
      "SELECT COUNT(*) AS total_products FROM products WHERE seller_id = ?",
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
      products: finalProducts,
      nextCursor,
      hasPrevMore,
      hasNextMore,
      totalCount: total_products,
    };
  } catch (err) {
    if (connection) await connection.rollback();
    throw err
  } finally {
    if (connection) connection.release();
  }
};
