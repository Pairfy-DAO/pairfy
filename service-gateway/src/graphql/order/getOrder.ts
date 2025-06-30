import database from "../../database/client.js";
import { findOrderByUser } from "../../common/findOrderByUser.js";
import { ApiGraphQLError, ERROR_CODES } from "@pairfy/common";

export const getOrder = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const { sellerData: SELLER, userData: USER } = context;

    const params = args.getOrderInput;

    console.log(params);

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

      console.log(findOrder)
      
      return {
        order: findOrder,
        shipping: null,
        address: null,
        session
      }
    }

  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
