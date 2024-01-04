import compression from "compression";
import {
  getAddressUtxosHandler,
  getAddressUtxos,
  createRoundHandler,
  createRoundMiddlewares,
} from "./routes";
import { errorHandler, checkPod, checkpoint } from "./pod/index";
import { NotFoundError, errorMiddleware } from "../global";
import { app } from "./app";
import blockfrost from "./client";

const main = async () => {
  try {
    /*
    if (!process.env.EXPRESS_PORT) {
      throw new Error("EXPRESS_PORT error");
    }

    if (!process.env.EXPRESS_TIMEOUT) {
      throw new Error("EXPRESS_TIMEOUT error");
    }

    if (!process.env.CORS_DOMAINS) {
      throw new Error("CORS_DOMAINS error");
    }

    */
    blockfrost.connect({
      projectId: "previewXgODba40jVJAs1QgKTBOAuwhvNFHHMVo",
    });

    checkpoint("ready");

    ///////////////////////////////////////////////////

    process.on("exit", (e) => errorHandler(e));

    process.on("SIGINT", (e) => errorHandler(e));

    process.on("SIGTERM", (e) => errorHandler(e));

    process.on("SIGQUIT", (e) => errorHandler(e));

    process.on("uncaughtException", (e) => errorHandler(e));

    process.on("unhandledRejection", (e) => errorHandler(e));

    ////////////////////////////////////////////////////

    app.post(
      "/api/audits/create-round",

      createRoundMiddlewares,

      createRoundHandler
    );

    app.get(
      "/api/frost/get-address-utxos/:address",

      getAddressUtxos,

      getAddressUtxosHandler
    );

    app.all("*", (_req, _res) => {
      throw new NotFoundError();
    });

    app.use(errorMiddleware);

    app.use(compression());
  } catch (e) {
    errorHandler(e);
  }
  checkPod();
};

main();
