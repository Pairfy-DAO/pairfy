import { getProduct } from "./handlers/getProduct.js";
import { createProduct } from "./handlers/create-product.js";
import { editProduct } from "./handlers/edit-product.js";
import { deleteProduct } from "./handlers/deleteProduct.js";
import { getProducts } from "./handlers/getProducts.js";

const products = {
  Query: {
    getProducts,
    getProduct,
  },
  Mutation: {
    createProduct,
    editProduct,
    deleteProduct,
  },
};

export { products };
