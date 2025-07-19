import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError, ERROR_CODES, logger } from "./index";

export interface SellerToken {
  id: string;
  role: string;
  email: string;
  avatar: string;
  address: string;
  country: string;
  username: string;
  pubkeyhash: string;
  wallet_name: string;
  rsa_version: string;
  rsa_public_key: string;
}

export const sellerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const privateKey = process.env.AGENT_JWT_KEY as string

    const sessionData = jwt.verify(
      req.session.jwt,
      privateKey
    ) as SellerToken;

    if (sessionData.role === "SELLER") {
      req.sellerData = sessionData;
    }
  } catch (err) {
    logger.error(err);
  }

  return next();
};

export const sellerRequired = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.sellerData) {
    return next(
      new ApiError(401, "Unauthorized seller", {
        code: ERROR_CODES.UNAUTHORIZED,
      })
    );
  }
  next();
};