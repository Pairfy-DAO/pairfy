import database from "../database/index.js";
import { Request, Response } from "express";
import {
  ApiError,
  ERROR_CODES,
  findSellerByEmail,
  updateSeller,
  verifyToken,
  hashPassword,
} from "@pairfy/common";
import {
  verifyParams,
  verifyTokenType,
} from "../validators/update-password.js";

export const updatePasswordMiddlewares: any = [];

export const updatePasswordHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const validateParams = verifyParams.safeParse(req.body);

    if (!validateParams.success) {
      throw new ApiError(400, "Validation error", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const parsedToken = verifyToken(
      validateParams.data.token,
      process.env.AGENT_JWT_KEY as string
    );

    if (!parsedToken) {
      throw new ApiError(401, "Invalid token", {
        code: ERROR_CODES.INVALID_TOKEN,
      });
    }

    const tokenContent = verifyTokenType.safeParse(parsedToken);

    if (!tokenContent.success) {
      throw new ApiError(401, "Invalid Token", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    /////////////////////////////////////////////////////////////////

    const params = validateParams.data;

    connection = await database.client.getConnection();

    const SELLER = await findSellerByEmail(connection, tokenContent.data.email);

    if (!SELLER) {
      throw new ApiError(404, "Seller not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (SELLER.verified !== 1) {
      throw new ApiError(403, "Email not verified", {
        code: ERROR_CODES.UNVERIFIED_EMAIL,
      });
    }

      ///////////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    const password = await hashPassword(params.password);

    const updatedSeller = await updateSeller(
      connection,
      SELLER.id,
      SELLER.schema_v,
      {
        password_hash: password,
        schema_v: SELLER.schema_v + 1,
      }
    );

    if (updatedSeller.affectedRows !== 1) {
      throw new ApiError(409, "Update failed: version mismatch or not found", {
        code: ERROR_CODES.UPDATE_CONFLICT,
      });
    }

    await connection.commit();

    ///////////////////////////////////////////////////////////////// END TRANSACTION

    res
      .status(200)
      .send({
        success: true,
        message: "The password has been changed successfully",
      });
  } catch (err: any) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
