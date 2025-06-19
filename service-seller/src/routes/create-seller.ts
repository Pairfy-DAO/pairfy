import database from "../database/index.js";
import { Request, Response } from "express";
import {
  ApiError,
  ERROR_CODES,
  findSellerByEmailOrUsername,
  hashPassword,
  getSellerId,
  createEvent,
  insertSeller,
  createToken,
  findSellerByEmail,
} from "@pairfy/common";
import {
  validateParams,
  RegistrationInput,
} from "../validators/create-seller.js";
import { generateRSA } from "../utils/rsa.js";
import { encryptAESGCM } from "../utils/aes.js";

export const createSellerMiddlewares: any = [validateParams];

export const createSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const timestamp = Date.now();

    const params = req.body as RegistrationInput;

    console.log(params); //TEST

    connection = await database.client.getConnection();

    const sellerExists = await findSellerByEmailOrUsername(
      connection,
      params.email,
      params.username
    );

    if (sellerExists) {
      throw new ApiError(400, "The email or username is already registered.", {
        code: ERROR_CODES.BAD_REQUEST,
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const sellerId = getSellerId();

    const password = await hashPassword(params.password);

    const RSAkeys = await generateRSA();

    const encriptedPrivateKey = await encryptAESGCM(
      RSAkeys.privateKeyB64,
      params.password
    );

    const tokenContent = {
      source: "service-seller",
      role: "SELLER",
      email: params.email,
      username: params.username,
    };

    const token = createToken(
      tokenContent,
      process.env.AGENT_JWT_KEY as string,
      "1h",
      "service-seller",
      ["register"]
    );

    const sellerScheme = {
      id: sellerId,
      username: params.username,
      email: params.email,
      password_hash: password,
      verified: false,
      country: params.country,
      terms_accepted: params.terms_accepted,
      rsa_version: 0,
      rsa_public_key: RSAkeys.publicKeyB64,
      rsa_private_key: [encriptedPrivateKey],
      avatar_base: "https://example.com",
      avatar_path: "/avatar.jpg",
      public_ip: req.publicAddress,
      created_at: timestamp,
      updated_at: timestamp,
      schema_v: 0,
    };

    console.log(sellerScheme);

    const [insertSellerResult] = await insertSeller(connection, sellerScheme);

    if (insertSellerResult.affectedRows !== 1) {
      throw new ApiError(500, "Unexpected error while creating seller.", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    const findSeller = await findSellerByEmail(connection, sellerScheme.email);

    await createEvent(
      connection,
      timestamp,
      "service-seller",
      "CreateSeller",
      JSON.stringify(findSeller),
      sellerId
    );

    const emailEvent = {
      type: "register:seller",
      username: params.username,
      email: params.email,
      token,
    };

    await createEvent(
      connection,
      timestamp,
      "service-seller",
      "CreateEmail",
      JSON.stringify(emailEvent),
      sellerId
    );

    await connection.commit();

    //////////////////////////////////////////////////////////////////////////////////////////

    res.status(200).send({
      success: true,
      message: "Successfully registered. Please check your inbox including the 'All Mail' and 'Spam' folders, for our email.",
    });
  } catch (err) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
