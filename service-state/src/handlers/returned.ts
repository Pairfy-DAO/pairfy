
import { getNotificationId } from "@pairfy/common";
import { HandlerParams } from "./types.js";

async function returned(params: HandlerParams) {
  const updateQuery = `
    UPDATE orders
    SET finished = ?,
        scanned_at = ?,
        status_log = ?,
        contract_state = ?,
        returned_tx = ?,
        returned_block = ?
    WHERE id = ?`;

  const statusLog = "returned";

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
      title: "Payment Returned",
      owner: params.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        buyer_address: params.buyer_address,
        country: params.country
      }),
      message: `The payment has been returned`,
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
      message: `The buyer has cancelled the order.`,
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

export { returned };
