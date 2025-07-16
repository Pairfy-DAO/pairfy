import database from "../../database/client.js";
import { findOrderByUser } from "../../common/findOrderByUser.js";
import { ApiGraphQLError, ERROR_CODES, decompress } from "@pairfy/common";
import { getOrderSchema } from "../../validators/getOrder.js";
import { findOrderBySeller } from "../../common/findOrderBySeller.js";
import { findSellerPrivateKey } from "../../common/findSellerPrivateKey.js";

export const getOrder = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validateParams = getOrderSchema.safeParse(args.getOrderInput);

    if (!validateParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(validateParams.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const params = validateParams.data;

    console.log(params);

    const { sellerData: SELLER, userData: USER } = context;

    connection = await database.client.getConnection();

    if (USER) {
      const order = await findOrderByUser(
        connection,
        params.id,
        USER.pubkeyhash
      );

      if (!order) {
        throw new ApiGraphQLError(404, "Order not found", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const product = decompress(order.product_snapshot);

      const address = null;

      const shipping = order.shipping_metadata;

      const session = `${order.id}:${order.buyer_pubkeyhash}:${order.seller_id}`;

      const encrypted_private_key = "none";

      return {
        order,
        product,
        address,
        shipping,
        session,
        encrypted_private_key,
      };
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (SELLER) {
      const order = await findOrderBySeller(connection, params.id, SELLER.id);

      if (!order) {
        throw new ApiGraphQLError(404, "Order not found", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const { rsa_private_key } = await findSellerPrivateKey(
        connection,
        SELLER.id
      );

      if (!rsa_private_key || rsa_private_key.length < 1) {
        throw new ApiGraphQLError(505, "Internal Error", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const product = decompress(order.product_snapshot);

      const address = order.pending_metadata;

      const shipping = order.shipping_metadata;

      const session = `${order.id}:${order.buyer_pubkeyhash}:${order.seller_id}`;
      
      const encrypted_private_key = JSON.stringify(
        rsa_private_key[order.rsa_version]
      );

      return {
        order,
        product,
        address,
        shipping,
        session,
        encrypted_private_key,
      };
    }
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
