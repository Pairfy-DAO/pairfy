import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import database from "../database/index.js";
import { Request, Response } from "express";
import {
  UserToken,
  userMiddleware,
  createToken,
  ApiError,
  ERROR_CODES,
} from "@pairfy/common";
import { getPubKeyHash } from "../utils/crypto";

import verifyDataSignature from "@cardano-foundation/cardano-verify-datasignature";
import { getUsername } from "../utils/nano.js";

const loginUserMiddlewares: any = [userMiddleware]; //validateParams

const loginUserHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    let params = req.body;

    const hexAddress = Cardano.Address.from_hex(params.address);

    const address32: string = hexAddress.to_bech32();

    const pubKeyHash = getPubKeyHash(hexAddress);

    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const verifySignature: boolean = verifyDataSignature(
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

    const username = getUsername();

    const schemeData = `
    INSERT INTO users (
      pubkeyhash,
      username,
      address,
      country,
      terms_accepted,
      public_ip,
      schema_v
     ) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      pubkeyhash = pubkeyhash,
      username = username,
      address = address,
      country = country,
      terms_accepted = terms_accepted,
      public_ip = VALUES(public_ip),
      schema_v = schema_v;
     `;

    const schemeValue = [
      pubKeyHash,
      username,
      address32,
      params.country,
      params.terms_accepted,
      req.publicAddress,
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    ///////////////////////////////////////////////////////////////////

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE pubkeyhash = ?",
      [pubKeyHash]
    );

    const USER = rows[0];

    const tokenData: UserToken = {
      pubkeyhash: USER.pubkeyhash,
      role: "USER",
      address: USER.address,
      wallet_name: params. wallet_name,
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
    if (connection)  await connection.rollback();
  } finally {
    if (connection) connection.release();
  }
};

export { loginUserMiddlewares, loginUserHandler };
