import { getNotificationId } from "@pairfy/common";
import { HandlerParams } from "./types.js";

async function canceled(params: HandlerParams) {
  const statusLog = "canceled";

  const updateQuery = `
    UPDATE orders
    SET finished = ?,
        scanned_at = ?,
        status_log = ?,
        contract_state = ?,
        canceled_tx = ?,
        canceled_block = ?
    WHERE id = ?`;

  const txHash = params.utxo.txHash + "#" + params.utxo.outputIndex;

  await params.connection.execute(updateQuery, [
    true,
    params.timestamp,
    statusLog,
    params.utxo.data.state,
    txHash,
    params.utxo.block_time,
    params.threadtoken,
  ]);

  /////////////////////////////////////////////////////////////////////

  const notifications = [
    {
      id: getNotificationId(),
      type: "order",
      title: "Order Cancelled",
      owner: params.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        buyer_address: params.buyer_address,
        country: params.country
      }),
      message: `The order has been cancelled and payment returned.`,
    },
    {
      id: getNotificationId(),
      type: "order",
      title: "Order Cancelled",
      owner: params.seller_id,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        seller_address: params.seller_address,
        country: params.country
      }),
      message: `The order has been cancelled by the buyer.`,
    },
  ];

  const eventSchema = `
    INSERT IGNORE INTO events (
    id,
    source,
    type,
    data,
    spec_version
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const eventId = params.threadtoken + statusLog;

  await params.connection.execute(eventSchema, [
    eventId,
    "gateway",
    "CreateNotification",
    JSON.stringify(notifications),
    0,
  ]);
}

export { canceled };
