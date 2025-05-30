import * as route from "./routes/index.js";
import compression from "compression";
import database from "./database/index.js";
import { ApiError, errorHandler, ERROR_EVENTS } from "@pairfy/common";
import { catchError } from "./utils/index.js";
import { app } from "./app.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "AGENT_JWT_KEY",
      "TOKEN_EXPIRATION",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "REDIS_RATELIMIT_URL"
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    app.post(
      "/api/user/login-user",

      route.loginUserMiddlewares,

      route.loginUserHandler
    );

    app.get(
      "/api/user/current-user",

      route.currentUserMiddlewares,

      route.currentUserHandler
    );

    app.get("/api/user/logout-user", route.logoutHandler);

    app.get("/api/user/ping", (req, res) => {
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

    app.listen(8005, () => console.log(`express server listening in 8005`));
  } catch (e) {
    catchError(e);
  }
};

main();
