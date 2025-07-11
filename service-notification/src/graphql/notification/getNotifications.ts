import { database } from "../../database/client.js";
import { findNotifications } from "../../utils/index.js";

export const getNotifications = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const { sellerData: SELLER, userData: USER } = context;

    connection = await database.client.getConnection();

    let owner = null;

    if (USER) {
      owner = USER.pubkeyhash;
    }

    if (SELLER) {
      owner = SELLER.id;
    }

    const unseen = await findNotifications(connection, owner, false, 25);

    const seen = await findNotifications(connection, owner, true, 25);

    return {
      unseen,
      seen
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
