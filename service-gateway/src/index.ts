import express from "express";
import http from "http";
import database from "./database/client.js";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { catchError } from "./utils/index.js";
import { typeDefs } from "./graphql/types.js";
import { books, orders } from "./graphql/resolvers.js";
import { agentMiddleware } from "./middleware/agent.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApiGraphQLError,
  ERROR_CODES,
  ERROR_EVENTS,
  getPublicAddress,
  logger,
  normalizeGraphError,
  RateLimiter,
} from "@pairfy/common";
import { redisClient } from "./database/redis.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "NETWORK_ENV",
      "REDIS_STATE_HOST",
      "REDIS_RATELIMIT_HOST",
      "TX_VALID_TIME",
      "TX_WATCH_WINDOW",
      "PENDING_RANGE",
      "SHIPPING_RANGE",
      "APPEAL_RANGE",
      "DELIVERY_RANGE",
      "AGENT_JWT_KEY",
      "EXPIRING_RANGE",
      "FEE_PERCENT",
      "DATABASE_NAME",
      "DATABASE_USER",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_PASSWORD",
      "PROJECT_ID",
      "KUPO_KEY",
      "OGMIOS_KEY",
      "WEAVIATE_HOST"
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    ////////////////////////////////////////////////////////////////////

    const app = express();

    const httpServer = http.createServer(app);

    const resolvers = {
      Query: {
        ...books.Query,
        ...orders.Query,
      },
      Mutation: {
        ...books.Mutation,
        ...orders.Mutation,
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-gateway",
          event: "graphql.error",
          message: "service-gateway graphql error",
          error: formattedError,
          stack: error,
        });

        return normalizeGraphError(error);
      },
    });

    await redisClient
      .connect({
        service: 'service-gateway',
        url: process.env.REDIS_STATE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("redisClient connected"))
      .catch((err: any) => catchError(err));

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const rateLimiter = new RateLimiter({
      source: "service-gateway",
      redisUrl: process.env.REDIS_RATELIMIT_HOST as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 60,
    });

    const sessionOptions: object = {
      name: "session",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: false,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    app.set("trust proxy", 1);

    app.use(cookieSession(sessionOptions));

    app.use(express.json({ limit: "5mb" }));

    app.use(express.urlencoded({ limit: "5mb", extended: true }));

    app.use(getPublicAddress);

    app.use(agentMiddleware);

    await server.start();

    app.use(
      "/api/gateway/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const AGENT = req.sellerData || req.userData;

          if (!AGENT) {
            throw new ApiGraphQLError(401, "Unauthorized", {
              code: ERROR_CODES.UNAUTHORIZED,
            });
          }

          const allowed = await rateLimiter.checkId(
            AGENT.pubkeyhash || AGENT.pubkeyhash
          );

          if (!allowed) {
            throw new ApiGraphQLError(429, "Rate limit exceeded", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            });
          }

          return {
            sellerData: req.sellerData || null,
            userData: req.userData || null,
          };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8006 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
