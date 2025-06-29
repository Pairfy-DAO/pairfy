import { redisPriceClient } from "../../database/redis.js";

export const getPrice = async () => {
  try {
    const result = await redisPriceClient.client.get("price:ADA");

    if (!result) {
      throw new Error("NO_PRICE");
    }

    return {
      success: true,
      message: 'OK',
      data: {
        ADA: parseFloat(result),
      },
    };
  } catch (err: any) {
    throw err
  }
};
