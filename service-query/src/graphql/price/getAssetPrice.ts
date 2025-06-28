import { redisPriceClient } from "../../database/redis.js";

export const getAssetPrice = async () => {
  try {
    const getPrice = await redisPriceClient.client.get("price:ADA");

    if (!getPrice) {
      throw new Error("NO_PRICE");
    }

    return {
      success: true,
      message: 'OK',
      data: {
        ADAUSD: parseFloat(getPrice),
      },
    };
  } catch (err: any) {
    throw err
  }
};
