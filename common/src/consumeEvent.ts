import { Connection } from "mysql2/promise";

export async function consumeEvent(
  connection: Connection,
  event: any,
  seq: number
) {
  const [result] = await connection.execute(
    "INSERT INTO processed (id, seq, type, processed, created_at) VALUES (?, ?, ?, ?, ?)",
    [event.id, seq, event.type, true, Date.now()]
  );

  const checkResult = "affectedRows" in result && result.affectedRows === 1;

  if (!checkResult) {
    throw new Error("consumeEventError");
  }
}
