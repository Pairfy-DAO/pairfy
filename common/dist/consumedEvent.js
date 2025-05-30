"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumedEvent = consumedEvent;
async function consumedEvent(connection, event, seq) {
    const [result] = await connection.execute("INSERT INTO processed (id, seq, type, processed, created_at) VALUES (?, ?, ?, ?, ?)", [event.id, seq, event.type, true, Date.now()]);
    const checkResult = "affectedRows" in result && result.affectedRows === 1;
    if (!checkResult) {
        throw new Error("consumedEventError");
    }
}
