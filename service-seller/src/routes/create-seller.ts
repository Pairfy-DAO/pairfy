import database from "../database/index.js";
import { Request, Response } from "express";
import { validateParams, RegistrationInput } from "../validators/create-seller.js";
import {
  ApiError,
  ERROR_CODES,
  findSellerByEmailOrUsername,
  hashPassword,
  getSellerId,
  createEvent,
  insertSeller,
  createToken,
  SellerEmailRegistrationToken,
  findSellerByEmail,
} from "@pairfy/common";

const createSellerMiddlewares: any = [validateParams];

const createSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body as RegistrationInput;

  console.log(params);

  try {
    connection = await database.client.getConnection();

    const sellerExists = await findSellerByEmailOrUsername(
      connection,
      params.email,
      params.username
    );

    if (sellerExists) {
      throw new ApiError(
        400,
        "The email address or username is already registered.",
        {
          code: ERROR_CODES.BAD_REQUEST,
        }
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const timestamp = Date.now();

    const password = await hashPassword(params.password);

    const sellerId = getSellerId();

    const emailToken: SellerEmailRegistrationToken = {
      source: "service-seller",
      role: "SELLER",
      email: params.email,
      username: params.username,
    };

    const token = createToken(
      emailToken,
      process.env.AGENT_JWT_KEY as string,
      "1h",
      "service-seller",
      ["register"]
    );

    const emailScheme = {
      type: "register:seller",
      username: params.username,
      email: params.email,
      token: token,
    };

    const sellerScheme = {
      id: sellerId,
      username: params.username,
      email: params.email,
      password_hash: password,
      verified: false,
      country: params.country,
      terms_accepted: params.terms_accepted,
      avatar_base: "https://example.com",
      avatar_path: "/avatar.jpg",
      public_ip: req.publicAddress,
      created_at: timestamp,
      updated_at: timestamp,
      schema_v: 0,
    };

    console.log(sellerScheme);

    const [sellerCreated] = await insertSeller(connection, sellerScheme);

    if (sellerCreated.affectedRows !== 1) {
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

    await createEvent(
      connection,
      timestamp,
      "service-seller",
      "CreateEmail",
      JSON.stringify(emailScheme),
      sellerId
    );

    await connection.commit();

    //////////////////////////////////////////////////////////////////////////////////////////

    res.status(200).send({
      success: true,
      data: {
        message: 'Please check your email in the "all" or "spam" folder.',
      },
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }

    throw err;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { createSellerMiddlewares, createSellerHandler };
