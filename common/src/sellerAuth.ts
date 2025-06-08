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
    const privateKey = Buffer.from(process.env.AGENT_JWT_KEY!, 'base64').toString('utf-8');

    const sessionData = jwt.verify(
      req.session.jwt,
      privateKey
    ) as SellerToken;

    if (sessionData.role === "SELLER") {
      const scheme = {
        ...sessionData,
        token: req.session.jwt,
      };

      req.sellerData = scheme;
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