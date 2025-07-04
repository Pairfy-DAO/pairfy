import { createEvent, getNotificationId } from "@pairfy/common";
import { UtxoData } from "../lib/index.js";
import { Connection } from "mysql2/promise";
import { updateOrder } from "../common/updateOrder.js";
import { jobResponse } from "./index.js";


export async function pending(
  connection: Connection,
  timestamp: number,
  orderData: any,
  data: UtxoData
): Promise<jobResponse> {
  if (!orderData.pending_notified) {
    const notifications = [
      {
        id: getNotificationId(),
        type: "order",
        title: "Payment Detected",
        owner: orderData.buyer_pubkeyhash,
        data: JSON.stringify({
          threadtoken: orderData.id,
          buyer_address: orderData.buyer_address,
          country: orderData.country,
          buyer_wallet: orderData.buyer_wallet
        }),
        message: `The payment is being processed on the network.`,
      },
      {
        id: getNotificationId(),
        type: "order",
        title: "New Purchase",
        owner: orderData.seller_id,
        data: JSON.stringify({
          threadtoken: orderData.id,
          seller_address: orderData.seller_address,
          country: orderData.country,
          seller_wallet: orderData.seller_wallet
        }),
        message: `Verify payment and accept the order.`,
      },
    ];

    await createEvent(
      connection,
      timestamp,
      "service-gateway",
      "CreateNotifications",
      JSON.stringify(notifications),
      orderData.buyer_pubkeyhash
    );
  }

  const updateContent = {
    status: "pending",
    contract_address: data.utxo.address,
    contract_state: data.datum.state,
    pending_tx: data.txHash,
    pending_block: data.blockTime,
    pending_metadata: data.metadata,
    pending_notified: true,
    scanned_at: timestamp,
  };

  await updateOrder(
    connection,
    orderData.id,
    orderData.schema_v,
    updateContent
  );

  await connection.commit();

  return { id: orderData.id, finished: false };
}
