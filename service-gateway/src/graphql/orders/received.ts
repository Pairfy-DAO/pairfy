import { receivedTransactionBuilder } from "../../cardano/builders/received.js";
import { UserToken } from "@pairfy/common";
import database from "../../database/client.js";

const receivedEndpoint = async (_: any, args: any, context: any) => {
  if (!context.userData) {
    throw new Error("CREDENTIALS");
  }
  const params = args.receivedEndpointInput;

  console.log(params);

  const BUYER = context.userData as UserToken;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [row] = await connection.execute(
      `SELECT
             id,
             finished,
             contract_params,
             contract_state
       FROM orders          
       WHERE id = ? AND buyer_pubkeyhash = ?`,
      [params.order_id, BUYER.pubkeyhash]
    );

    if (!row.length) {
      throw new Error("NO_ORDER");
    }

    const ORDER = row[0];

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === 3) {
      throw new Error("ALREADY_RECEIVED");
    }

    if (ORDER.contract_state !== 2) {
      throw new Error("WRONG_STATE");
    }

    //////////////////////////////////////////////

    const BUILDER = await receivedTransactionBuilder(
      BUYER.address,
      ORDER.contract_params
    );

    return {
      success: true,
      payload: {
        cbor: BUILDER.cbor,
      },
    };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { receivedEndpoint };
