import { ApiGraphQLError, ERROR_CODES, SellerToken } from "@pairfy/common";
import { collectTransactionBuilder } from "../../cardano/builders/collect.js";
import { findOrderBySeller } from "../../common/findOrderBySeller.js";
import database from "../../database/client.js";

export const collectEndpoint = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    if (!context.sellerData) {
      throw new ApiGraphQLError(401, "Invalid credentials", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const params = args.collectEndpointInput;

    console.log(params);

    const { sellerData: SELLER } = context as {
      sellerData: SellerToken;
    };

    connection = await database.client.getConnection();

    const ORDER = await findOrderBySeller(
      connection,
      params.order_id,
      SELLER.id
    );

    if (!ORDER) {
      throw new ApiGraphQLError(404, "Order not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === 4) {
      throw new Error("ALREADY_COLLECTED");
    }

    if (![2, 3].includes(ORDER.contract_state)) {
      throw new Error("WRONG_STATE");
    }

    const BUILDER = await collectTransactionBuilder(
      SELLER.address,
      ORDER.contract_params
    );

    return {
      success: true,
      data: {
        cbor: BUILDER.cbor,
      },
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
