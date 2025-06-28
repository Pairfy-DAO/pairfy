import database from "../../database/client.js";
import { pendingTransactionBuilder } from "../../cardano/builders/pending.js";
import { getContractFee, getContractPrice } from "../../lib/index.js";
import { pendingEndpointSchema } from "../../validators/orders.js";
import {
  ApiGraphQLError,
  ERROR_CODES,
  findProductById,
  findSellerById,
  UserToken,
} from "@pairfy/common";
import { redisClient } from "../../database/redis.js";
import { insertOrder } from "../../lib/order.js";
import { chunkMetadata } from "../../lib/metadata.js";

export const pendingEndpoint = async (_: any, args: any, context: any) => {
  if (!context.userData) {
    throw new ApiGraphQLError(401, "Invalid Credentials", {
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  const validateParams = pendingEndpointSchema.safeParse(
    args.pendingEndpointInput
  );

  if (!validateParams.success) {
    throw new ApiGraphQLError(
      400,
      `Invalid params ${validateParams.error.flatten()}`,
      {
        code: ERROR_CODES.VALIDATION_ERROR,
      }
    );
  }

  let connection = null;

  try {
    const timestamp = Date.now()

    const { userData: USER } = context as { userData: UserToken };

    const params = validateParams.data;

    connection = await database.client.getConnection();

    const findProduct = await findProductById(connection, params.product_id);

    if (!findProduct) {
      throw new ApiGraphQLError(404, "Product not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const findSeller = await findSellerById(connection, findProduct.seller_id);

    if (!findSeller) {
      throw new ApiGraphQLError(404, "Seller not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    /*
    const getAssetPrice = await redisClient.client.get("price:ADAUSDT"); ///param valida

    if (!getAssetPrice) {
      throw new ApiGraphQLError(404, "Asset not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }
*/

    const getAssetPrice = "1.00";

    //////////////////////////////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    const contractPrice: number = getContractPrice(
      findProduct.discount,
      findProduct.discount_value,
      findProduct.price,
      params.order_units,
      parseFloat(getAssetPrice),
      "ADAUSDT"
    );

    const contractFee: number = getContractFee(contractPrice, 10);

    const operatorWallet =
      "a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141";

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const metadata = chunkMetadata('x'.repeat(344), 64)

    const BUILDER = await pendingTransactionBuilder(
      operatorWallet,
      USER.address,
      findSeller.pubkeyhash,
      BigInt(contractPrice),
      BigInt(contractFee),
      metadata
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const orderContent = {
      id: BUILDER.threadTokenPolicyId,
      type: 'cardano',
      seller_id: findProduct.seller_id,
      country: findProduct.country,
      buyer_pubkeyhash: USER.pubkeyhash,
      buyer_address: USER.address,
      buyer_wallet: USER.wallet_name,
      buyer_username: USER.username,
      seller_pubkeyhash: findSeller.pubkeyhash,
      seller_address: findSeller.address,
      seller_wallet: findSeller.wallet_name,
      seller_username: findSeller.username,
      rsa_version: findSeller.rsa_version,
      product_id: findProduct.id,
      contract_address: BUILDER.stateMachineAddress,
      contract_params: BUILDER.serializedParams,
      contract_price: contractPrice,
      contract_fee: contractFee,
      contract_units: params.order_units,
      asset_price: parseFloat(getAssetPrice),
      watch_until: BUILDER.watchUntil,
      pending_until: BUILDER.pendingUntil,
      shipping_until: BUILDER.shippingUntil,
      expire_until: BUILDER.expireUntil,
      created_at: timestamp,
      updated_at: timestamp,
      schema_v: 0
    };

    console.log(orderContent);

    const [insert1] = await insertOrder(connection, orderContent)

    if (insert1.affectedRows !== 1) {
      throw new ApiGraphQLError(500, "Error creating order", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    //////////////////////////////////////////////////////////////////////////////////// END TRANSACTION

    await connection.commit();

    return {
      success: true,
      message: "The transaction has been generated successfully, sign it and send it to the network.",
      data: {
        cbor: BUILDER.cbor,
        order: BUILDER.threadTokenPolicyId,
        spk: findSeller.rsa_public_key
      },
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
