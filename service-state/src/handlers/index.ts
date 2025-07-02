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
import { getOrderStatus } from "../lib/order.js";

export async function testHandler(job: any) {
  let connection = null;

  try {
    const timestamp = Date.now();

    const orderData = job.data;

    connection = await database.client.getConnection();

    const orderStatus = await getOrderStatus(redisState.client, orderData.id);

    if (orderStatus) {
      const { status, scan_until } = orderStatus;

      if (status === "finished") {
        return { finished: true, id: orderData.id };
      }

      if (scan_until) {
        if (scan_until < Date.now()) {
          return { finished: false, id: orderData.id };
        }
      }
    }

    const result = await getUtxo(orderData.id);

    const { success, failed, ...UTXO } = result;

    //////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    if (!success && !failed && UTXO) {

      const data: UtxoData = UTXO as UtxoData;

      switch (data.datum.state) {
        case null:
          break;
        case 0n:
          await pending(connection, timestamp, orderData, data);
          break;
      }
    }

    const updateContent = {
      finished: false,
      scanned_at: timestamp,
      status: "created",
    };

    await updateOrder(
      connection,
      orderData.id,
      orderData.schema_v,
      updateContent
    );

    await connection.commit();

    //////////////////////////////////////////////////////////// TRANSACTION END

    return { finished: false, id: orderData.id };
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
