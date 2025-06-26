import database  from "../database/client.js";
import { getOrder } from "./cardano/get-order.js";
import { pendingEndpoint } from "./cardano/pending.js";
import { lockingEndpoint } from "./cardano/locking.js";
import { returnEndpoint } from "./cardano/return.js";
import { shippingEndpoint } from "./cardano/shipping.js";
import { receivedEndpoint } from "./cardano/received.js";
import { collectEndpoint } from "./cardano/collect.js";
import { cancelEndpoint } from "./cardano/cancel.js";
import { appealEndpoint } from "./cardano/appeal.js";
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

export const cardano = {
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

