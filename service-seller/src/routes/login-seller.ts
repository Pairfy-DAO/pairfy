import { BadRequestError, comparePassword } from "../../global";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { _ } from "../utils/pino";
import DB from "../db";
import { SellerToken, sellerMiddleware } from "../utils/seller";

const loginSellerMiddlewares: any = [sellerMiddleware];

const loginSellerHandler = async (req: Request, res: Response) => {
  let conn = null;
  let params = req.body;
  try {
    if (params.sellerData) {
      throw new BadRequestError("logged");
    }

    conn = await DB.client.getConnection();

    const [rows] = await conn.execute("SELECT * FROM seller WHERE email = ?", [
      params.email,
    ]);

    if (rows.length === 0) {
      throw new BadRequestError("failed");
    }

    const seller = rows[0];

    const passwordsMatch = await comparePassword(
      seller.password_hash,
      params.password
    );

    if (!passwordsMatch) throw new BadRequestError("failed");

    if (seller.verified !== 1) {
      throw new BadRequestError("unverified");
    }

    const sellerData: SellerToken = {
      seller_id: seller.seller_id,
      role: "seller",
      email: seller.email,
      nickname: seller.nickname,
    };

    const token = createToken(sellerData);

    req.session = {
      jwt: token,
    };

    res.status(200).send({ success: true, data: sellerData });
  } catch (err) {
    await conn.rollback();

    _.error(err);

    throw new BadRequestError("invalid credential o unverified");
  } finally {
    conn.release();
  }
};

export { loginSellerMiddlewares, loginSellerHandler };
