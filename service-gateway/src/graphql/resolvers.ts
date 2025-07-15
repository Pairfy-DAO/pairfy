import { pendingEndpoint } from "./cardano/pending.js";
import { lockingEndpoint } from "./cardano/locking.js";
import { returnedEndpoint } from "./cardano/returned.js";
import { shippingEndpoint } from "./cardano/shipping.js";
import { receivedEndpoint } from "./cardano/received.js";
import { collectEndpoint } from "./cardano/collect.js";
import { cancelEndpoint } from "./cardano/cancel.js";
import { appealEndpoint } from "./cardano/appeal.js";
import { getBooks } from "./book/getBooks.js";
import { editBook } from "./book/editBook.js";
import { getOrder } from "./order/getOrder.js";

////////////////////////////////////////////////////////////////

export const order = {
  Query: {
    getOrder,
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
    cancelEndpoint,
    returnedEndpoint,
    lockingEndpoint,
    shippingEndpoint,
    appealEndpoint,
    receivedEndpoint,
    collectEndpoint
  },
};

