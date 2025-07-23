import { Connection } from "mysql2/promise";
import { updateOrder } from "../common/updateOrder.js";
import { jobResponse } from "./index.js";

export async function expired(
  connection: Connection,
  timestamp: number,
  orderData: any
): Promise<jobResponse> {
  await connection.beginTransaction();

  await updateOrder(connection, orderData.id, orderData.schema_v, {
    status: "expired",
    finished: true,
    scanned_at: timestamp,
  });

  await connection.commit();

  return { id: orderData.id, finished: true };
}
