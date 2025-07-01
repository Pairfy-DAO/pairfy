import database from "../../database/client.js";
import { findOrderByUser } from "../../common/findOrderByUser.js";
import { ApiGraphQLError, ERROR_CODES } from "@pairfy/common";
import { getOrderSchema } from "../../validators/getOrder.js";

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
      const findOrder = await findOrderByUser(
        connection,
        params.id,
        USER.pubkeyhash
      );

      if (!findOrder) {
        throw new ApiGraphQLError(404, "Order not found", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const session = `${findOrder.id}:${findOrder.buyer_pubkeyhash}:${findOrder.seller_id}`;

      return {
        order: findOrder,
        shipping: null,
        address: null,
        session,
      };
    }
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
