import { catchError } from "./utils/index.js";
import { Queue, Worker } from "bullmq";
import { redisClient } from "./database/redis.js";
import { getAssetPriceHandler } from "./handlers/assets.js";
import { ERROR_EVENTS, logger } from "@pairfy/common";

const main = async () => {
  try {
    const requiredEnvVars = ["NODE_ENV", "REDIS_PRICE_HOST"];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    await redisClient
      .connect({
        url: process.env.REDIS_PRICE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("redisClient connected"))
      .catch((err: any) => catchError(err));

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    const priceQueue = new Queue("getAssetPrice", {
      connection: { url: process.env.REDIS_PRICE_HOST },
    });

    const repeatableJobs = await priceQueue.getJobSchedulers();

    for (const job of repeatableJobs) {
      try {
        await priceQueue.removeJobScheduler(job.key);
        console.log(`✅ Removed repeatable job: ${job.name} (${job.key})`);
      } catch (err) {
        console.error(`❌ Failed to remove job: ${job.name} (${job.key})`, err);
      }
    }

    await priceQueue.add(
      "ADAUSDT",
      {
        symbol: "ADAUSDT",
        base: "ADA",
      },
      {
        repeat: {
          every: 30000,
        },
        attempts: 0,
        backoff: {
          type: "fixed",
          delay: 1000,
          jitter: 0.5,
        },
        removeOnComplete: true,
        removeOnFail: true,
        jobId: "ADAUSDT",
      }
    );

    logger.info("Queue added.");

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    const priceWorker = new Worker("getAssetPrice", getAssetPriceHandler, {
      removeOnComplete: false,
      removeOnFail: false,
      autorun: true,
      drainDelay: 1000,
      concurrency: 2,
      connection: { url: process.env.REDIS_PRICE_HOST },
    } as any);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    priceWorker.on("failed", (job: any, err) => {
      logger.error("FAILED", job.id, err);
    });

    priceWorker.on("completed", (job: any, result) => {
      logger.info("COMPLETED", job.id, result);
    });

    priceWorker.on("error", (err) => {
      logger.error(err);
    });

    priceWorker.on("stalled", (job: any) => {
      logger.info("STALLED", job.id);
    });

    priceWorker.on("drained", () => {
      logger.info("DRAINED");
    });

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, async (err) => {
        logger.error(err);
        await priceWorker.close();
        await redisClient.client.close();
        process.exit(1);
      })
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
