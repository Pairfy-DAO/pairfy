import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getProductId } from "../utils/nano";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { _ } from "../utils/pino";
import DB from "../db";

const createProductMiddlewares: any = [sellerMiddleware, requireAuth];

const createProductHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const seller = req.sellerData;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    INSERT INTO product (
      product_id,
      seller_id,
      title,
      category,
      price,
      collateral,
      stock,
      slots,
      note,
      keywords,
      theme,
      terms,
      country,
      image_base,
      image_path,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getProductId(),
      seller.seller_id,
      params.title,
      params.category,
      params.price,
      params.collateral,
      params.stock,
      params.slots,
      params.note,
      params.keywords,
      params.theme,
      params.terms,
      params.country,
      params.image_base,
      params.image_path,
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("failed");
  } finally {
    connection.release();
  }
};

export { createProductMiddlewares, createProductHandler };
