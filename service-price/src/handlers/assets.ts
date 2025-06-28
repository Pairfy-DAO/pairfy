import { redisClient } from "../database/redis.js";
import { axiosAPI } from "../api/index.js";
import { logger } from "@pairfy/common";
import { Job } from "bullmq";

type BinanceResponse = { mins: number; price: string; closeTime: number };

export async function getAssetPriceHandler(job: Job) {
  try {
    let symbol = job.data.symbol;

    let response: any = await axiosAPI.get(`/api/v3/avgPrice?symbol=${symbol}`);

    if (response.status === 200) {
      let payload: BinanceResponse = response.data;

      let assetPrice = Number(parseFloat(payload.price).toFixed(2));

      let key = "price:" + symbol;

      await redisClient.client.set(key, assetPrice, {
        EX: 120,
      });
      
      console.log(`✅${symbol}:${assetPrice}`);
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
