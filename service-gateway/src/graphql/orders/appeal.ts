import { appealTransactionBuilder } from "../../cardano/builders/appeal.js";
import { UserToken } from "../../middleware/agent.js";
import database from "../../database/client.js";

const appealEndpoint = async (_: any, args: any, context: any) => {
  if (!context.userData) {
    throw new Error("CREDENTIALS");
  }
  const params = args.appealEndpointInput;

  console.log(params);

  const USER = context.userData as UserToken;

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
      [params.order_id, USER.pubkeyhash]
    );

    if (!row.length) {
      throw new Error("NO_ORDER");
    }

    const ORDER = row[0];

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === -3) {
      throw new Error("ALREADY_APPEAL");
    }

    if (ORDER.contract_state !== 2) {
      throw new Error("WRONG_STATE");
    }


    //////////////////////////////////////////////

    const BUILDER = await appealTransactionBuilder(
      USER.address,
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

export { appealEndpoint };
