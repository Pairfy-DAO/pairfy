import { database } from "../database/client.js";
import { getUtxo, UtxoData, UtxoResponse } from "../lib/index.js";
import { pending } from "./pending.js";
import { returned } from "./returned.js";
import { locking } from "./locking.js";
import { handleShipping } from "./shipping.js";
import { handleReceived } from "./received.js";
import { collected } from "./collected.js";
import { canceled } from "./canceled.js";
import { appealed } from "./appealed.js";
import { HandlerParams } from "./types.js";
import { logger, sleep } from "@pairfy/common";
import { updateOrder } from "../common/updateOrder.js";
import { redisState } from "../database/redis.js";
import { getOrderStatus, saveOrderStatus } from "../lib/order.js";
import { findOrderById } from "../common/findOrderById.js";
import { expired } from "./expired.js";

export type jobResponse = {
  id: string;
  finished: boolean;
};

export async function testHandler(job: any): Promise<jobResponse> {
  let connection = null;

  try {
    const timestamp = Date.now();

    const { id } = job.data;

    connection = await database.client.getConnection();

    const ORDER = await findOrderById(connection, id);

    if (!ORDER) {
      return { id, finished: true };
    }

    const result = await getUtxo(ORDER.id);

    const { success, failed, ...utxoData } = result;

    console.log(success, failed);

    let response: jobResponse = { id: ORDER.id, finished: ORDER.finished };

    //////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    if (!success && !failed) {
      if (timestamp > ORDER.watch_until) {
        console.log("🕒 Expired", ORDER.id);

        response = await expired(connection, timestamp, ORDER);
        return response;
      }
    }

    if (success && !failed && utxoData) {
      const data: UtxoData = utxoData as UtxoData;

      switch (data.datum.state) {
        case null:
          break;
        case 0n:
          response = await pending(connection, timestamp, ORDER, data);
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

/** 
export async function threadtokenQueue(job: any) {
  let connection = null;

  try {
    const {
      threadtoken,
      watch_until,
      seller_id,
      buyer_pubkeyhash,
      buyer_address,
      seller_address,
      country,
    } = job.data;

    const { code, utxo } = await getUtxo(threadtoken);

    console.log(code);

    console.log(utxo);

    const timestamp = Date.now();

    let finished = false;

    let status = "created";

    if (timestamp > watch_until && code === 404) {
      finished = true;
      status = "expired";
    }

    connection = await database.client.getConnection();

    ///////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    if (code === 200) {
      const handlerParams: HandlerParams = {
        connection,
        threadtoken,
        timestamp,
        utxo,
        seller_id,
        buyer_pubkeyhash,
        buyer_address,
        seller_address,
        country,
      };
      switch (utxo.data.state) {
        case null:
          break;
        case 0n:
          await pending(handlerParams);
          break;
        case -1n:
          await returned(handlerParams);
          break;
        case 1n:
          await locking(handlerParams);
          break;
        case -2n:
          await canceled(handlerParams);
          break;
        case 2n:
          await handleShipping(handlerParams);
          break;
        case -3n:
          await appealed(handlerParams);
          break;
        case 3n:
          await handleReceived(handlerParams);
          break;
        case 4n:
          await collected(handlerParams);
          break;
      }
    } else {
      const updateQuery = `
        UPDATE orders
        SET finished = ?,
            scanned_at = ?,
            status_log = ?
        WHERE id = ?`;

      await connection.execute(updateQuery, [
        finished,
        timestamp,
        status,
        threadtoken,
      ]);
    }

    await connection.commit();

    ///////////////////////////////////////////////////////////////

    return {
      threadtoken,
      finished,
      timestamp,
    };
  } catch (err) {
    logger.error(err);

    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
}
*/
