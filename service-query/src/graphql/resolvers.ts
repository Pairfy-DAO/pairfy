import { searchProducts } from "./product/searchProducts.js";
import { getProduct } from "./product/getProduct.js";
import { getAssetPrice } from "./price/getAssetPrice.js";
import { getFeed } from "./feed/getFeed.js";


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
    getAssetPrice,
  },
};

