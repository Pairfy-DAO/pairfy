import { pendingEndpoint } from "./cardano/pending.js";
import { lockingEndpoint } from "./cardano/locking.js";
import { returnedEndpoint } from "./cardano/returned.js";
import { shippingEndpoint } from "./cardano/shipping.js";
import { receivedEndpoint } from "./cardano/received.js";
import { collectedEndpoint } from "./cardano/collected.js";
import { canceledEndpoint } from "./cardano/canceled.js";
import { appealedEndpoint } from "./cardano/appealed.js";
import { getBooks } from "./book/getBooks.js";
import { editBook } from "./book/editBook.js";
import { getOrder } from "./order/getOrder.js";
import { getOrders } from "./order/getOrders.js";

////////////////////////////////////////////////////////////////

export const order = {
  Query: {
    getOrder,
    getOrders
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
  Mutation: {
    pendingEndpoint,
    canceledEndpoint,
    returnedEndpoint,
    lockingEndpoint,
    shippingEndpoint,
    appealedEndpoint,
    receivedEndpoint,
    collectedEndpoint
  },
};

