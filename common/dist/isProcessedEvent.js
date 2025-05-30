"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProcessedEvent = isProcessedEvent;
async function isProcessedEvent(connection, id) {
    const [findProcessed] = await connection.execute("SELECT id FROM processed WHERE id = ? AND processed = ?", [id, true]);
    if (findProcessed.length > 0) {
        return true;
    }
    else {
        return false;
    }
}
