"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMediasByProductId = findMediasByProductId;
async function findMediasByProductId(connection, product_id) {
    const [rows] = await connection.execute(`SELECT * FROM media WHERE product_id = ?`, [product_id]);
    return rows || [];
}
