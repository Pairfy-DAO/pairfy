import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getSellerId } from "../utils/nano";
import { _ } from "../utils/pino";
import DB from "../db";

const createUserMiddlewares: any = [];

const createUserHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    INSERT INTO users (
      id,
      username,
      wallet,
      signed_tx,
      country,
      trade_terms,
      terms_accepted,
      public_ip,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getSellerId(),
      params.username,
      params.wallet,
      params.signed_tx,
      params.country,
      "Terms and conditions acepted.",
      params.terms_accepted,
      "192.168.1.1",
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true, message: "Successfully registered" });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("invalid username or wallet");
  } finally {
    connection.release();
  }
};

export { createUserMiddlewares, createUserHandler };
