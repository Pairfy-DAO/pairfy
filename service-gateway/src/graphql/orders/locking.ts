import { SellerToken } from "@pairfy/common";
import { lockingTransactionBuilder } from "../../cardano/builders/locking.js";
import database from "../../database/client.js";

const lockingEndpoint = async (_: any, args: any, context: any) => {
  if (!context.sellerData) {
    throw new Error("CREDENTIALS");
  }
  const params = args.lockingEndpointInput;

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

    if (ORDER.contract_state === 1) {
      throw new Error("ALREADY_LOCKING");
    }

    if (ORDER.contract_state !== 0) {
      throw new Error("STATE_DIFF_ZERO");
    }

    //////////////////////////////////////////////

    const BUILDER = await lockingTransactionBuilder(
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

export { lockingEndpoint };
