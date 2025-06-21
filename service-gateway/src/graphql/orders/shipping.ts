import { shippingTransactionBuilder } from "../../cardano/builders/shipping.js";
import { chunkMetadata, encryptMetadata } from "../../lib/metadata.js";
import database from "../../database/client.js";
import { SellerToken } from "@pairfy/common";

const shippingEndpoint = async (_: any, args: any, context: any) => {
  if (!context.sellerData) {
    throw new Error("CREDENTIALS");
  }

  const params = args.shippingEndpointInput;

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

    if (ORDER.contract_state === 2) {
      throw new Error("ALREADY_DISPATCHED");
    }

    if (ORDER.contract_state !== 1) {
      throw new Error("STATE_DIFF");
    }

    //////////////////////////////////////////////

    const deliveryDate = BigInt(params.date);

    const extension =
      deliveryDate + BigInt(process.env.DELIVERY_RANGE as string);

    const appealUntil =
      deliveryDate + BigInt(process.env.APPEAL_RANGE as string);

    //////////////////////////////////////////////

    const PGPVersion = "1.0";

    const shippingData = {
      order_id: params.order_id,
      guide: params.guide,
      date: deliveryDate.toString(),
      extension: extension.toString(),
      appeal_until: appealUntil.toString(),
      website: params.website,
      notes: params.notes,
      version: PGPVersion,
    };

    const encrypted = await encryptMetadata(
      JSON.stringify(shippingData),
      PGPVersion
    );

    const metadata = {
      version: PGPVersion,
      msg: chunkMetadata(encrypted, 64),
    };

    //////////////////////////////////////////////

    const BUILDER = await shippingTransactionBuilder(
      SELLER.address,
      ORDER.contract_params,
      deliveryDate,
      metadata
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

export { shippingEndpoint };
