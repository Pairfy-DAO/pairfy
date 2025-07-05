import { ApiGraphQLError, ERROR_CODES } from "@pairfy/common";
import { updateNotifications } from "../../utils/index.js";
import { database } from "../../database/client.js";

export const editNotifications = async (_: any, args: any, context: any) => {
  const { sellerData: SELLER, userData: USER } = context;

  let connection = null;

  try {
    const params = args.editNotifications;

    console.log(params);

    connection = await database.client.getConnection();

    /////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    let owner = null;

    if (USER) {
      owner = USER.pubkeyhash;
    }

    if (SELLER) {
      owner = SELLER.id;
    }

    const updateResult = await updateNotifications(
      connection,
      params.ids,
      owner
    );

    if (updateResult?.affectedRows !== 1) {
      throw new ApiGraphQLError(500, "Error updating notifications", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    await connection.commit();

    /////////////////////////////////////////////////////////// TRANSACTION END

    return { success: true, message: "OK" };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
