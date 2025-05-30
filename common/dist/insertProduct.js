"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertProduct = insertProduct;
async function insertProduct(connection, scheme) {
    const columns = Object.keys(scheme);
    const values = Object.values(scheme);
    const sql = `
    INSERT INTO products (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;
    return await connection.execute(sql, values);
}
