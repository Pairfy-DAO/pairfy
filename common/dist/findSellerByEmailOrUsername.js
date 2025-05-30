"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSellerByEmailOrUsername = findSellerByEmailOrUsername;
async function findSellerByEmailOrUsername(connection, email, username) {
    const [rows] = await connection.execute(`SELECT * FROM sellers WHERE email = ? OR username = ? LIMIT 1`, [email, username]);
    return rows?.[0] || null;
}
