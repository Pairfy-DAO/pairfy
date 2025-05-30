export async function findUserByPubKeyhash(
  connection: any,
  pubKeyHash: string
): Promise<any | null> {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE pubkeyhash = ? LIMIT 1",
      [pubKeyHash]
    );

    return rows?.[0] ?? null;
  } catch {
    return null;
  }
}
