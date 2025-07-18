import database from "../database/index.js";
import { Request, Response } from "express";
import { userMiddleware } from "@pairfy/common";
import { findUserPrivateKey } from "../common/findUserPrivateKey.js";

export const currentUserMiddlewares: any = [userMiddleware];

export const currentUserHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    connection = await database.client.getConnection();

    const encryptedPrivateKey = await findUserPrivateKey(
      connection,
      req.userData.id
    );

    const userData = {
      ...req.userData,
      rsa_private_key: encryptedPrivateKey
    }

    res.status(200).send({ success: true, data: userData });
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
