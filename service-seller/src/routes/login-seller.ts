import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import database from "../database/index.js";
import { Request, Response } from "express";
import {
  ApiError,
  ERROR_CODES,
  createToken,
  comparePassword,
  SellerToken,
  sellerMiddleware,
  findSellerByEmail,
  updateSeller,
  isValidSignatureCIP30
} from "@pairfy/common";
import { getPubKeyHash } from "../utils/blockchain.js";
import { LoginInput, validateParams } from "../validators/login-seller.js";

const loginSellerMiddlewares: any = [sellerMiddleware, validateParams];

const loginSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    let params = req.body as LoginInput;

    const hexAddress = Cardano.Address.from_hex(params.address);

    const address32: string = hexAddress.to_bech32();

    const pubKeyHash = getPubKeyHash(hexAddress);

    const message = "SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const verifySignature = isValidSignatureCIP30(
      params.signature.signature,
      params.signature.key,
      message,
      address32
    );

    if (!verifySignature) {
      throw new ApiError(401, "Signature error", {
        code: ERROR_CODES.INVALID_SIGNATURE,
      });
    }

    /////////////////////////////////////////////////////////////////

    connection = await database.client.getConnection();

    const SELLER = await findSellerByEmail(connection, params.email);

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

    /////////////////////////////////////////////////////////////////

    const passwordsMatch = await comparePassword(
      SELLER.password_hash,
      params.password
    );

    if (!passwordsMatch) {
      throw new ApiError(401, "Invalid Credentials", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    /////////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const sellerData: SellerToken = {
      id: SELLER.id,
      role: "SELLER",
      email: SELLER.email,
      avatar: SELLER.avatar_base + SELLER.avatar_path,
      address: address32,
      country: SELLER.country,
      username: SELLER.username,
      pubkeyhash: pubKeyHash,
    };

    const updatedSeller = await updateSeller(
      connection,
      SELLER.id,
      SELLER.schema_v,
      {
        pubkeyhash: pubKeyHash,
        address: address32,
        schema_v: SELLER.schema_v + 1,
      }
    );

    if (updatedSeller.affectedRows !== 1) {
      throw new ApiError(409, "Update failed: version mismatch or not found", {
        code: ERROR_CODES.UPDATE_CONFLICT,
      });
    }

    const token = createToken(
      sellerData,
      process.env.AGENT_JWT_KEY as string,
      process.env.TOKEN_EXPIRATION as string,
      "service-seller",
      ["vault", "internal"]
    );

    req.session = {
      jwt: token,
    };

    await connection.commit();

    /////////////////////////////////////////////////////////////////

    res.status(200).send({ success: true, data: sellerData });
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw err
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { loginSellerMiddlewares, loginSellerHandler };
