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

export async function saveStatus(
  client: any,
  orderId: string,
  status: string
): Promise<void> {
  try {
    const statusKey = `${orderId}:${status}`;

    const exists = await client.exists(statusKey);

    if (!exists) {
      await client.set(statusKey, 0, { expiration: { type: "EX", value: 3600 } });
    } else {
      await client.incr(statusKey);

      const iterationsStr = await client.get(statusKey);

      if (iterationsStr) {
        const iterations = parseInt(iterationsStr);

        let scanUntil = null;

        const now = Date.now();

        if (iterations === 3) {
          scanUntil = now + 5 * 60 * 1000;
          console.log("🕛 Sleep 5m SET");
        } else if (iterations === 4) {
          scanUntil = now + 10 * 60 * 1000;
          console.log("🕛 Sleep 10m SET");
        } else if (iterations >= 5) {
          scanUntil = now + 15 * 60 * 1000;
          console.log("🕛 Sleep 15m SET");
        }

        if (scanUntil) {
          await client.set(`${orderId}:sleep`, scanUntil.toString(), {
            expiration: { type: "EX", value: 3600 }
          });
        }
      }
    }
  } catch (err: any) {
    console.error(err);
  }
}

export async function getSleepUntil(client: any, orderId: string) {
  try {
    const result = await client.get(`${orderId}:sleep`);

    if (result) {
      return parseInt(result);
    }

    return null;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}
