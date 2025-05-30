"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMediaById = findMediaById;
async function findMediaById(connection, id) {
    const [rows] = await connection.execute(`SELECT * FROM media WHERE id = ?`, [id]);
    return rows?.[0] || null;
}
