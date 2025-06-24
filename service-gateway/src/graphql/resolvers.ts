import database  from "../database/client.js";
import { getOrder } from "./orders/get-order.js";
import { pendingEndpoint } from "./orders/pending.js";
import { lockingEndpoint } from "./orders/locking.js";
import { returnEndpoint } from "./orders/return.js";
import { shippingEndpoint } from "./orders/shipping.js";
import { receivedEndpoint } from "./orders/received.js";
import { collectEndpoint } from "./orders/collect.js";
import { cancelEndpoint } from "./orders/cancel.js";
import { appealEndpoint } from "./orders/appeal.js";
import { getBooks } from "./books/getBooks.js";
import { editBook } from "./books/editBooks.js";

const getOrders = async (_: any, args: any, context: any) => {
  const params = args.updateProductInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

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

////////////////////////////////////////////////////////////////

export const products = {
  Query: {
    getOrders,
  },
};

////////////////////////////////////////////////////////////////

export const books = {
  Query: {
    getBooks,
  },
  Mutation: {
    editBook,
  },
};

////////////////////////////////////////////////////////////////

export const orders = {
  Query: {
    getOrder,
  },
  Mutation: {
    pendingEndpoint,
    cancelEndpoint,
    returnEndpoint,
    lockingEndpoint,
    shippingEndpoint,
    appealEndpoint,
    receivedEndpoint,
    collectEndpoint
  },
};

