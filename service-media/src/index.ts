import compression from "compression";
import database from "./database/index.js";
import * as route from "./routes/index.js";
import { catchError, errorEvents } from "./utils/index.js";
import { ensureBucketExists, minioClient } from "./database/minio.js";
import { Request, Response } from "express";
import { app } from "./app.js";
import {
  ApiError,
  ERROR_CODES,
  errorHandler,
  logger,
  RateLimiter,
} from "@pairfy/common";


const main = async () => {
  try {
    const requiredEnv = [
      "NODE_ENV",
      "AGENT_JWT_KEY",
      "MINIO_HOST_URL",
      "MINIO_PORT",
      "MINIO_USE_SSL",
      "MINIO_ACCESS_KEY",
      "MINIO_SECRET_KEY",
      "INTERNAL_ENDPOINT_SECRET",
    ];

    for (const key of requiredEnv) {
      if (!process.env[key]) {
        throw new Error(`${key} error`);
      }
    }

    errorEvents.forEach((e: string) => process.on(e, (err) => catchError(err)));

    minioClient.connect({
      endPoint: process.env.MINIO_HOST_URL as string,
      port: parseInt(process.env.MINIO_PORT as string, 10),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY as string,
      secretKey: process.env.MINIO_SECRET_KEY as string,
    });

    ensureBucketExists(minioClient.client, "media");

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const rateLimiter = new RateLimiter({
      source: "service-media",
      redisUrl: process.env.REDIS_RATELIMIT_URL as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 60,
    });

    app.post(
      "/api/media/create-files",

      rateLimiter.middlewareJwt(),
      ...route.createFilesMiddlewares,

      route.createFilesHandler
    );

    app.post(
      "/api/media/update-files",

      rateLimiter.middlewareJwt(),
      ...route.updateFilesMiddlewares,

      route.updateFilesHandler
    );

    app.post(
      "/api/media/verify-group",

      route.verifyGroupMiddlewares,

      route.verifyGroupHandler
    );

    app.get(
      "/api/media/get-file/groups/:groupId/:filename",
      rateLimiter.middlewareIp(),
      ...route.getFileMiddlewares,
      route.getFileHandler
    );

    app.get(
      "/api/media/ping",
      rateLimiter.middlewareIp(),
      (req: Request, res: Response) => {
        res.status(200).json({ success: true, data: { message: "Test OK" } });
      }
    );

    app.all("*", (req, _res, next) => {
      next(
        new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, {
          code: ERROR_CODES.NOT_FOUND,
        })
      );
    });

    app.use(errorHandler);

    app.use(compression());

    app.listen(8003, () => logger.info(`express server listening in 8003`));
  } catch (e) {
    catchError(e);
  }
};

main();
