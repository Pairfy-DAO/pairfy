"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByPubKeyhash = findUserByPubKeyhash;
async function findUserByPubKeyhash(connection, pubKeyHash) {
    try {
        const [rows] = await connection.execute("SELECT * FROM users WHERE pubkeyhash = ? LIMIT 1", [pubKeyHash]);
        return rows?.[0] ?? null;
    }
    catch {
        return null;
    }
}
