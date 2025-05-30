import * as route from "./routes/index.js";
import database from "./database/index.js";
import compression from "compression";
import { logger } from "@pairfy/common";
import { catchError } from "./utils/index.js";
import { ApiError, errorHandler, ERROR_EVENTS } from "@pairfy/common";
import { app } from "./app.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "AGENT_JWT_KEY",
      "TOKEN_EXPIRATION",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "REDIS_RATELIMIT_URL"
    ];

    for (const key of requiredEnvVars) {
      if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }

    ERROR_EVENTS.forEach((e: string) => process.on(e, (err) => catchError(err)));

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    
    app.post(
      "/api/seller/create-seller",

      route.createSellerMiddlewares,

      route.createSellerHandler
    );

    app.post(
      "/api/seller/verify-seller",

      route.verifySellerMiddlewares,

      route.verifySellerHandler
    );

    app.post(
      "/api/seller/login-seller",

      route.loginSellerMiddlewares,

      route.loginSellerHandler
    );

    app.get(
      "/api/seller/current-seller",

      route.currentSellerMiddlewares,

      route.currentSellerHandler
    );

    app.get(
      "/api/seller/logout-seller",

      route.logoutHandler
    );

    app.get("/api/seller/ping", (req, res) => {
      res.status(200).send("Test OK");
    });

    app.all("*", (req, _res, next) => {
      next(
        new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, {
          code: "ROUTE_NOT_FOUND",
        })
      );
    });

    app.use(errorHandler);

    app.use(compression());

    app.listen(8000, () =>
      logger.info(`express server listening in 8000`)
    );
  } catch (e) {
    catchError(e);
  }
};

main();
