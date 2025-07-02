import { getNotificationId } from "@pairfy/common";
import { UtxoData, UtxoResponse } from "../lib/index.js";
import { Connection } from "mysql2/promise";
import { updateOrder } from "../common/updateOrder.js";

export async function pending(
  connection: Connection,
  timestamp: number,
  orderData: any,
  data: UtxoData
) {
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

  const updateContent = {
    scanned_at: timestamp,
    status: "pending",
    contract_address: data.utxo?.address,
    contract_state: data?.datum?.state,
    pending_tx: data.txHash,
    pending_block: data.blockTime,
    pending_metadata: data.metadata,
  };

  await updateOrder(
    connection,
    orderData.id,
    orderData.schema_v,
    updateContent
  );

  /////////////////////////////////////////////////////////////////////
/** 
  const notifications = [
    {
      id: getNotificationId(),
      type: "order",
      title: "Payment Detected",
      owner: data.buyer_pubkeyhash,
      data: JSON.stringify({
        threadtoken: data.threadtoken,
        buyer_address: data.buyer_address,
        country: data.country,
      }),
      message: `The payment is being processed on the network.`,
    },
    {
      id: getNotificationId(),
      type: "order",
      title: "New Purchase",
      owner: data.seller_id,
      data: JSON.stringify({
        threadtoken: data.threadtoken,
        seller_address: data.seller_address,
        country: data.country,
      }),
      message: `Verify payment and accept the order.`,
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

  const eventId = data.threadtoken + statusLog;

  await data.connection.execute(eventSchema, [
    eventId,
    "gateway",
    "CreateNotification",
    JSON.stringify(notifications),
    0,
  ]);

  */
}
