import { SellerToken } from "@pairfy/common";
import { collectTransactionBuilder } from "../../cardano/builders/collect.js";
import database from "../../database/client.js";

const collectEndpoint = async (_: any, args: any, context: any) => {
  if (!context.sellerData) {
    throw new Error("CREDENTIALS");
  }
  const params = args.collectEndpointInput;

  console.log(params);

  const SELLER = context.sellerData as SellerToken;

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
       WHERE id = ? AND seller_id = ?`,
      [params.order_id, SELLER.id]
    );

    if (!row.length) {
      throw new Error("NO_ORDER");
    }

    const ORDER = row[0];

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === 4) {
      throw new Error("ALREADY_COLLECTED");
    }
    if (ORDER.contract_state !== 3 && ORDER.contract_state !== 2) {
      throw new Error("WRONG_STATE");
    }
    //////////////////////////////////////////////

    const BUILDER = await collectTransactionBuilder(
      SELLER.address,
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

export { collectEndpoint };
