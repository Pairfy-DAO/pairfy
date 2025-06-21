import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumeEvent,
  logger,
  insertProduct,
} from "@pairfy/common";

export const CreateProduct = async (event: any, seq: number): Promise<boolean> => {
    let response = null;
  
    let connection = null;
  
    try {
      connection = await database.client.getConnection();
  
      const processed = await isProcessedEvent(connection, event.id);

      if (processed) {

        logger.error({
          service: "service-gateway-consumer",
          event: "event.repeated",
          message: `event repeated`,
          eventId: event.id,
        });
  
        return Promise.resolve(true);
      }
  
      const dataParsed = JSON.parse(event.data);
  
      await connection.beginTransaction();
  
      ///////////////////////////////////////////////////////
  
      const [insertProductResult] = await insertProduct(connection, dataParsed);

      if (insertProductResult.affectedRows !== 1) {
        throw new Error("insertProductError");
      }
  
      await consumeEvent(connection, event, seq);

      ///////////////////////////////////////////////////////
  
      await connection.commit();

      logger.info({
        service: "service-gateway-consumer",
        event: "event.consumed",
        message: 'event consumed',
        eventId: event.id
      })
  
      response = Promise.resolve(true);
    } catch (error: any) {
      logger.error({
        service: "service-gateway-consumer",
        event: "event.error",
        message: `event error`,
        eventId: event.id,
        error,
      });
  
      if (connection) await connection.rollback();
  
      response = Promise.resolve(false);
    } finally {
      if (connection) connection.release();
    }
  
    return response;
  };
  