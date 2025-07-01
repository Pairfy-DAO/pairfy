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
