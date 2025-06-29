import { searchProducts } from "./product/searchProducts.js";
import { getProduct } from "./product/getProduct.js";
import { getPrice } from "./price/getPrice.js";
import { getFeed } from "./feed/getFeed.js";
import { getBook } from "./books/getBook.js";

export const books = {
  Query: {
    getBook
  },
};


export const feed = {
  Query: {
    getFeed
  },
};

export const products = {
  Query: {
    getProduct,
    searchProducts
  },
};

export const assets = {
  Query: {
    getPrice,
  },
};

