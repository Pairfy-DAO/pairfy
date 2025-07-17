import { shippingTransactionBuilder } from "../../cardano/builders/shipping.js";
import { ApiGraphQLError, ERROR_CODES, SellerToken } from "@pairfy/common";
import { findOrderBySeller } from "../../common/findOrderBySeller.js";
import { chunkMetadata } from "../../lib/metadata.js";
import database from "../../database/client.js";

export const shippingEndpoint = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    if (!context.sellerData) {
      throw new ApiGraphQLError(401, "Invalid credentials", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const params = args.shippingEndpointInput;

    console.log(params); //zod

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

    if (ORDER.contract_state === 2) {
      throw new Error("ALREADY_DISPATCHED");
    }

    if (ORDER.contract_state !== 1) {
      throw new Error("STATE_DIFF");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    const deliveryDate = BigInt(params.date);

    const deliveryTolerance =
      deliveryDate + BigInt(process.env.DELIVERY_TOLERANCE as string);

    const appealUntil =
      deliveryDate + BigInt(process.env.APPEAL_RANGE as string);

    const shippingData = {
      public: {
        id: ORDER.id,
        date: deliveryDate.toString(),
        tolerance: deliveryTolerance.toString(),
        appeal_until: appealUntil.toString()
      },
      private: {
        guide: params.guide,
        website: params.website,
        notes: params.notes
      },
      version: "1.0", //ENV VAR
    };

    const metadata = chunkMetadata(JSON.stringify(shippingData), 64); //move to @common

    ////////////////////////////////////////////////////////////////////////////////////////////

    const BUILDER = await shippingTransactionBuilder(
      SELLER.address,
      ORDER.contract_params,
      deliveryTolerance,
      metadata
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
