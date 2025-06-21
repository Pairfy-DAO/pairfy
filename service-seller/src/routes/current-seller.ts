import { Request, Response } from "express";
import { sellerMiddleware } from "@pairfy/common";

export const currentSellerMiddlewares: any = [sellerMiddleware];

export const currentSellerHandler = async (req: Request, res: Response) => {
  res.send({ sellerData: req.sellerData || null });
};

