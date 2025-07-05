export async function findOrdersCustom(
  connection: any,
  scanRange: number,
  queryLimit: number
) {
  const queryScheme = `
      SELECT id,
             finished,
             scanned_at,
             country,
             seller_id,
             buyer_pubkeyhash,
             buyer_address,
             seller_address,
             watch_until,
             schema_v
      FROM orders
      WHERE finished = ? AND scanned_at < ?
      ORDER BY created_at ASC
      LIMIT ? 
      FOR UPDATE SKIP LOCKED`;

  const [rows] = await connection.query(queryScheme, [
    false,
    scanRange,
    queryLimit,
  ]);

  return rows;
}

export type OrderStatus = {
  scan_until: number | null;
};

export async function saveOrderStatus(
  client: any,
  id: string,
  status: OrderStatus,
  ttlSeconds = 3600
): Promise<void> {
  return await client.set(`order:${id}`, JSON.stringify(status), {
    expiration: { type: "EX", value: ttlSeconds },
  });
}

export async function getOrderStatus(
  client: any,
  id: string
): Promise<OrderStatus | null> {

  try {
    const result = await client.get(`order:${id}`);
  
    if (!result) return null;

    return JSON.parse(result) as OrderStatus;
  } catch (err) {
    throw err
  }
}