import { database } from "../database/client.js";
import { getUtxo, UtxoData } from "../lib/index.js";
import { pending } from "./pending.js";
import { returned } from "./returned.js";
import { locking } from "./locking.js";
import { shipping } from "./shipping.js";
import { received } from "./received.js";
import { collected } from "./collected.js";
import { canceled } from "./canceled.js";
import { appealed } from "./appealed.js";
import { redisState } from "../database/redis.js";
import { getSleepUntil } from "../lib/order.js";
import { findOrderById } from "../common/findOrderById.js";
import { expired } from "./expired.js";

export type jobResponse = {
  id: string;
  finished: boolean;
};

export async function testHandler(job: any): Promise<jobResponse> {
  const { id } = job.data;

  let connection = null;

  try {
    const timestamp = Date.now();

    const sleepUntil = await getSleepUntil(redisState.client, id);

    if (sleepUntil) {
      if (timestamp < sleepUntil) {
        console.log("🕛 SLEEPING", sleepUntil, timestamp);
        return { id, finished: false };
      }
    }

    connection = await database.client.getConnection();

    const ORDER = await findOrderById(connection, id);

    if (!ORDER) {
      return { id, finished: true };
    }

    let response: jobResponse = { id: ORDER.id, finished: ORDER.finished };

    if (ORDER.finished) {
      return response;
    }

    const { success, failed, ...data } = await getUtxo(ORDER.id);

    console.log(success, failed);

    //////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    if (!success && !failed && ORDER.status === "created") {
      if (timestamp > ORDER.watch_until) {
        console.log("🕒 Expired", ORDER.id);

        response = await expired(connection, timestamp, ORDER);
        return response;
      }
    }

    if (success && !failed && data) {
      const utxoData: UtxoData = data as UtxoData;

      switch (utxoData.datum.state) {
        case null:
          break;
        case 0n:
          response = await pending(connection, timestamp, ORDER, utxoData);
          break;
        case 1n:
          response = await locking(connection, timestamp, ORDER, utxoData);
          break;
        case 2n:
          response = await shipping(connection, timestamp, ORDER, utxoData);
          break;
        case 3n:
          response = await received(connection, timestamp, ORDER, utxoData);
          break;
        case 4n:
          response = await collected(connection, timestamp, ORDER, utxoData);
          break;
      }
    }

    return response;

    //////////////////////////////////////////////////////////// TRANSACTION END
  } catch (err) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
}