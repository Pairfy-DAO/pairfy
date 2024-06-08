import { BadRequestError } from "../errors";
import { comparePassword } from "../utils/password";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { UserToken, userMiddleware } from "../utils/user";
import { _ } from "../utils/pino";
import DB from "../db";

const loginUserMiddlewares: any = [userMiddleware];

const loginUserHandler = async (req: Request, res: Response) => {
  let connection = null;
  let params = req.body;
  try {
    if (params.userData) {
      throw new Error("logged");
    }

    connection = await DB.client.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE wallet = ?",
      [params.wallet]
    );

    if (rows.length === 0) {
      throw new Error("nonexist");
    }

    const USER = rows[0];

    const passwordsMatch = await comparePassword(
      USER.password_hash,
      params.password
    );

    if (!passwordsMatch) throw new BadRequestError("failed");

    if (USER.verified !== 1) {
      throw new Error("unverified");
    }

    const userData: UserToken = {
      id: USER.id,
      role: "USER",
      wallet: USER.wallet,
      avatar: USER.avatar_base + USER.avatar_path,
      country: USER.country,
      username: USER.username,
    };

    const token = createToken(userData);

    req.session = {
      jwt: token,
    };

    res.status(200).send({ success: true, data: userData });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("invalid credentials or unverified check your wallet");
  } finally {
    connection.release();
  }
};

export { loginUserMiddlewares, loginUserHandler };
