import { getNotificationId } from "@pairfy/common";
import { HandlerParams } from "./types.js";

async function appealed(params: HandlerParams) {
  const updateQuery = `
    UPDATE orders
    SET scanned_at = ?,
        status_log = ?,
        contract_state = ?,
        appealed_tx = ?,
        appealed_block = ?
    WHERE id = ?`;

  const statusLog = "appealed";

  const txHash = params.utxo.txHash + "#" + params.utxo.outputIndex;

  await params.connection.execute(updateQuery, [
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
      title: "Order Appealed",
      owner: params.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        buyer_address: params.buyer_address,
        country: params.country,
      }),
      message: `The order has been appealed.`,
    },
    {
      id: getNotificationId(),
      type: "order",
      title: "Order Appealed",
      owner: params.seller_id,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        seller_address: params.seller_address,
        country: params.country,
      }),
      message: `The order has been appealed.`,
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

export { appealed };
