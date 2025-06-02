import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import database from "../database/index.js";
import { Request, Response } from "express";
import {
  UserToken,
  createToken,
  ApiError,
  ERROR_CODES,
  getUserNickname,
  isValidSignatureCIP30,
  findUserByPubKeyhash,
} from "@pairfy/common";
import { getPubKeyHash } from "../utils/crypto.js";
import { verifyParams } from "../validators/login-user.js";

export const loginUserMiddlewares: any = [];

export const loginUserHandler = async (req: Request, res: Response) => {
  const timestamp = Date.now();

  let connection = null;

  try {
    const result = verifyParams.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(401, "Unauthorized", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const params = result.data;

    console.log(params);

    const hexAddress = Cardano.Address.from_hex(params.address);

    const address32: string = hexAddress.to_bech32();

    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const pubKeyHash = getPubKeyHash(hexAddress);

    const username = getUserNickname();

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

    await connection.beginTransaction();

    const schemeData = `
    INSERT INTO users (
      pubkeyhash,
      username,
      address,
      country,
      terms_accepted,
      public_ip,
      wallet_name,
      created_at,
      updated_at,
      schema_v
     ) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      wallet_name = VALUES(wallet_name),
      public_ip = VALUES(public_ip),
      updated_at = VALUES(updated_at),
      schema_v = schema_v + 1;
     `;

    const schemeValue = [
      pubKeyHash,
      username,
      address32,
      params.country,
      params.terms_accepted,
      req.publicAddress,
      params.wallet_name,
      timestamp,
      timestamp,
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    ///////////////////////////////////////////////////////////////////

    const USER = await findUserByPubKeyhash(connection, pubKeyHash);

    if (!USER) {
      throw new ApiError(500, "Internal signature verification error", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    const tokenData: UserToken = {
      pubkeyhash: USER.pubkeyhash,
      role: "USER",
      address: USER.address,
      wallet_name: params.wallet_name,
      country: USER.country,
      username: USER.username,
    };

    console.log(schemeValue);

    const token = createToken(tokenData);

    req.session = {
      jwt: token,
    };

    const userData = {
      ...tokenData,
      token,
    };

    await connection.commit();

    res.status(200).send({ success: true, data: userData });
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
