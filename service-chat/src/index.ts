import express from "express";
import Redis from "ioredis";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { catchError } from "./utils/index.js";
import { redisClient } from "./database/redis.js";
import { typeDefs } from "./graphql/types.js";
import { messages } from "./graphql/resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import {
  ApiGraphQLError,
  ERROR_CODES,
  ERROR_EVENTS,
  getPublicAddress,
  logger,
  normalizeGraphError,
  verifyToken,
} from "@pairfy/common";
import { agentMiddleware } from "./common/agent.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const main = async () => {
  try {
    const requiredEnvVars = ["AGENT_JWT_KEY", "REDIS_HOST"];

    requiredEnvVars.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`${key} error`);
      }
    });

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    //////////////////////////////////////////////////////////////////////////////////////////////////

    const pubsubOptions = {
      connectTimeout: 100000,
      keepAlive: 100000,
      retryStrategy: (times: any) => Math.min(times * 50, 2000),
    };

    const pubsub = new RedisPubSub({
      publisher: new Redis(process.env.REDIS_HOST as string, pubsubOptions),
      subscriber: new Redis(process.env.REDIS_HOST as string, pubsubOptions),
    });

    const resolvers = {
      Query: {
        ...messages.Query,
      },
      Mutation: {
        ...messages.Mutation,
      },
      Subscription: {
        ...messages.Subscription,
      },
    };

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = express();

    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/api/chat/graphql",
    });

    const serverCleanup = useServer(
      {
        schema,
        onConnect: async (ctx) => {
          const authToken = ctx.connectionParams?.authToken;

          if (!authToken) {
            throw new Error("Unauthorized");
          }

          if (typeof authToken !== "string") {
            throw new Error("Unauthorized");
          }
        },
        context: async (ctx, msg, args) => {
          const agentData = verifyToken(
            ctx.connectionParams?.authToken as string,
            process.env.AGENT_JWT_KEY as string
          );

          if (!agentData) {
            throw new Error("Unauthorized");
          }

          logger.info("ChatConnection", agentData);

          return {
            pubsub,
            agentData,
          };
        },
        onDisconnect(ctx, code, reason) {
          console.log("Disconnected!");
        },
      },
      wsServer
    );

    const server = new ApolloServer({
      schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-chat",
          event: "graphql.error",
          message: "service-chat graphql error",
          error: formattedError,
          stack: error,
        });

        return normalizeGraphError(error);
      },
    });

     //////////////////////////////////////////////////////////////////////////////////////////////////

    await redisClient
      .connect({
        url: process.env.REDIS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
        retryStrategy: (times: any) => Math.min(times * 50, 2000),
      })
      .then(() => console.log("✅ redisClient connected"))
      .catch((err: any) => catchError(err));

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
      "/api/chat/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { sellerData, userData } = req;

          console.log(sellerData, userData);

          if (!sellerData && !userData) {
            throw new ApiGraphQLError(401, "Unauthorized", {
              code: ERROR_CODES.UNAUTHORIZED,
            });
          }

          return {
            sellerData,
            userData,
            redisClient: redisClient.client,
            pubsub,
          };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8010 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
