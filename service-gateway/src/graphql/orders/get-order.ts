import { decryptMetadata } from "../../lib/metadata.js";
import { UserToken } from "../../middleware/agent.js";
import database from "../../database/client.js";
import { SellerToken } from "@pairfy/common";

const getOrder = async (_: any, args: any, context: any) => {
  const USER = (context.userData as UserToken) || null;

  const SELLER = (context.sellerData as SellerToken) || null;

  const params = args.getOrderInput;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    if (USER) {
      const [orders] = await connection.execute(`
        SELECT
          o.*,
          s.username AS seller_username,
          s.verified AS seller_verified,
          s.trade_terms AS seller_trade_terms,
          s.avatar_base AS seller_avatar_base,
          s.avatar_path AS seller_avatar_path
        FROM orders o
        INNER JOIN 
          sellers s
        ON 
          o.seller_id = s.id
        WHERE
          o.id = ? AND o.buyer_pubkeyhash = ?`,
        [params.id, USER.pubkeyhash]
      );

      if (!orders.length) {
        throw new Error("NO_ORDER");
      }

      const { id, buyer_pubkeyhash, seller_id, shipping_metadata } = orders[0];

      const session = `${id}:${buyer_pubkeyhash}:${seller_id}`;

      const shippingMetadata = await decryptMetadata(shipping_metadata);

      return {
        order: orders[0],
        shipping: shippingMetadata,
        address: null,
        session,
      };
    }

    if (SELLER) {
      const [orders] = await connection.execute(
        "SELECT * FROM orders WHERE id = ? AND seller_id = ?",
        [params.id, SELLER.id]
      );

      if (!orders.length) {
        throw new Error("NO_ORDER");
      }

      const { id, buyer_pubkeyhash, seller_id, pending_metadata, shipping_metadata } = orders[0];

      const session = `${id}:${buyer_pubkeyhash}:${seller_id}`;

      const pendingMetadata = await decryptMetadata(pending_metadata);

      const shippingMetadata = await decryptMetadata(shipping_metadata);

      return {
        order: orders[0],
        shipping: shippingMetadata,
        address: pendingMetadata,
        session,
      };
    }
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

export { getOrder };
