"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
/**Update model without data verification without error handling */
const updateProduct = async (connection, id, schema_v, data) => {
    const fields = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
    const sql = `
    UPDATE products
    SET ${fields}
    WHERE id = ? AND schema_v = ?
    `;
    const values = [...Object.values(data), id, schema_v];
    const [rows] = await connection.execute(sql, values);
    return rows;
};
exports.updateProduct = updateProduct;
