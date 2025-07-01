
import { getNotificationId } from "@pairfy/common";
import { HandlerParams } from "./types.js";

async function handleShipping(params: HandlerParams) {
  const updateQuery = `
    UPDATE orders
    SET scanned_at = ?,
        status_log = ?,
        contract_state = ?,
        shipping_tx = ?,
        shipping_block = ?,
        shipping_metadata = ?
    WHERE id = ?`;

  const statusLog = "shipping";
  
  const txHash = params.utxo.txHash + "#" + params.utxo.outputIndex;

  await params.connection.execute(updateQuery, [
    params.timestamp,
    statusLog,
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
      title: "Package Shipped",
      owner: params.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        buyer_address: params.buyer_address,
        country: params.country,
      }),
      message: "The seller sent the package.",
    },
    {
      id: getNotificationId(),
      type: "order",
      title: "Package Shipped",
      owner: params.seller_id,
      data: JSON.stringify({
        threadtoken: params.threadtoken,
        seller_address: params.seller_address,
        country: params.country,
      }),
      message: "The package has been sent.",
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

export { handleShipping };
