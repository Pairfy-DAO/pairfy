import { getNotificationId } from "@pairfy/common";
import { HandlerParams } from "./types.js";

async function pending(params: HandlerParams) {

  const updateQuery = `
    UPDATE orders
    SET scanned_at = ?,
        status_log = ?,
        contract_address = ?,
        contract_state = ?,
        pending_tx = ?,
        pending_block = ?,
        pending_metadata = ?
    WHERE id = ?`;

  const statusLog = "pending";

  const txHash = params.utxo.txHash + "#" + params.utxo.outputIndex;

  await params.connection.execute(updateQuery, [
    params.timestamp,
    statusLog,
    params.utxo.address,
    params.utxo.data.state,
    txHash,
    params.utxo.block_time,
    params.utxo.metadata,
    params.threadtoken,
  ]);

  /////////////////////////////////////////////////////////////////////

  const notifications = [
    {
      id: getNotificationId(),
      type: "order",
      title: "Payment Detected",
      owner: params.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        buyer_address: params.buyer_address,
        country: params.country
      }),
      message: `The payment is being processed on the network.`,
    },
    {
      id: getNotificationId(),
      type: "order",
      title: "New Purchase",
      owner: params.seller_id,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        seller_address: params.seller_address,
        country: params.country
      }),
      message: `Verify payment and accept the order.`
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

export { pending };
