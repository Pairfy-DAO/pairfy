"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductById = findProductById;
async function findProductById(connection, id) {
    const [rows] = await connection.execute(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows?.[0] || null;
}
