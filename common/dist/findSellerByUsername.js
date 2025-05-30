"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSellerByUsername = findSellerByUsername;
async function findSellerByUsername(connection, username) {
    const [rows] = await connection.execute(`SELECT * FROM sellers WHERE username = ?`, [username]);
    return rows?.[0] || null;
}
