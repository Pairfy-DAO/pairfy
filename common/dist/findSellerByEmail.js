"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSellerByEmail = findSellerByEmail;
async function findSellerByEmail(connection, email) {
    const [rows] = await connection.execute(`SELECT * FROM sellers WHERE email = ?`, [email]);
    return rows?.[0] || null;
}
