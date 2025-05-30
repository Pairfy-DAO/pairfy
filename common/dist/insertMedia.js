"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMedia = insertMedia;
async function insertMedia(connection, scheme) {
    const columns = Object.keys(scheme);
    const values = Object.values(scheme);
    const sql = `
    INSERT INTO media (${columns.join(", ")})
    VALUES (${columns.map(() => "?").join(", ")})
  `;
    return await connection.execute(sql, values);
}
