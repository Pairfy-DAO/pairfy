"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductBySku = findProductBySku;
async function findProductBySku(connection, seller, sku) {
    const [rows] = await connection.execute(`SELECT * FROM products WHERE seller_id = ? AND sku = ?`, [seller, sku]);
    return rows?.[0] || null;
}
