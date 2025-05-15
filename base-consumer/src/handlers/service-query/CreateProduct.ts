import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumedEvent,
  logger,
  insertProduct,
} from "@pairfy/common";
import { createProductIndex } from "./utils/weaviate.js";

export const CreateProduct = async (
  event: any,
  seq: number
): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const processed = await isProcessedEvent(connection, event.id);

    if (processed) {
      return Promise.resolve(true);
    }

    const dataParsed = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const [productCreated] = await insertProduct(connection, dataParsed);

    if (productCreated.affectedRows !== 1) {
      throw new Error("CreateProductError");
    }

    const createIndex = await createProductIndex(dataParsed);

    if(!createIndex){
      throw new Error("CreateProductIndexError");
    }

    await consumedEvent(connection, event, seq);

    ///////////////////////////////////////////////////////

    await connection.commit();

    logger.info({
      service: "service-query-consumer",
      event: "event.consumed",
      message: 'event consumed',
      eventId: event.id
    })

    response = Promise.resolve(true);
  } catch (error: any) {
    logger.error({
      service: "service-query-consumer",
      event: "event.error",
      message: `event error`,
      eventId: event.id,
      error: error.message,
      stack: error.stack
    });

    if (connection) await connection.rollback();

    response = Promise.resolve(false);
  } finally {
    if (connection) connection.release();
  }

  return response;
};
