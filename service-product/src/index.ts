import * as route from "./routes";
import { catcher, check, checkpoint } from "./pod/index";
import { NotFoundError, errorMiddleware } from "./errors";
import { app } from "./app";
import compression from "compression";
import DB from "./db";

const main = async () => {
  try {
    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.EXPRESS_PORT) {
      throw new Error("EXPRESS_PORT error");
    }

    if (!process.env.EXPRESS_TIMEOUT) {
      throw new Error("EXPRESS_TIMEOUT error");
    }

    if (!process.env.CORS_DOMAINS) {
      throw new Error("CORS_DOMAINS error");
    }

    if (!process.env.SELLER_JWT_KEY) {
      throw new Error("SELLER_JWT_KEY error");
    }

    if (!process.env.TOKEN_EXPIRATION) {
      throw new Error("TOKEN_EXPIRATION error");
    }

    DB.connect({
      host: "10.101.74.192",
      port: 3306,
      user: "marketplace",
      password: "password",
      database: "service_seller",
    });

    const { Kafka } = require("kafkajs");

    const kafka = new Kafka({
      clientId: "service-product",
      ssl: false,
      enforceRequestTimeout: false,
      brokers: [
        "10.109.180.56:9092",
        "10.109.180.56:9092",
        "10.109.180.56:9092",
      ],
    });

    const run = async () => {
      const consumer = kafka.consumer({ groupId: "service-product-group" });

      await consumer.connect();

      await consumer.subscribe({ topic: "fulfillment.service_seller.seller", fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
          console.log({
            topic,
            partition,
            value: message.value.toString(),
          });
        },
      });
    };

    run().catch(console.error);

    checkpoint("ready");

    const errorEvents: string[] = [
      "exit",
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "uncaughtException",
      "unhandledRejection",
    ];

    errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

    app.post(
      "/api/seller/create-seller",

      route.createSellerMiddlewares,

      route.createSellerHandler
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
      "/api/seller/logout",

      route.logoutHandler
    );

    app.all("*", (_req, _res) => {
      throw new NotFoundError();
    });

    app.use(errorMiddleware);

    app.use(compression());
  } catch (e) {
    catcher(e);
  }
  check();
};

main();
