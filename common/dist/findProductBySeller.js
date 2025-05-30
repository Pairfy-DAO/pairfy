"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductBySeller = findProductBySeller;
async function findProductBySeller(connection, id, sellerId) {
    const [rows] = await connection.execute(`SELECT * FROM products WHERE id = ? AND seller_id = ? LIMIT 1`, [id, sellerId]);
    return rows?.[0] || null;
}
