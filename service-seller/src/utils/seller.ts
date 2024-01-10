import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";
import jwt from "jsonwebtoken";

interface SellerToken {
  seller_id: string;
  role: string;
  email: string;
  nickname: string;
}

declare global {
  namespace Express {
    interface Request {
      sellerData: SellerToken;
    }
  }
}

const sellerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as SellerToken;

    if (sessionData.role !== "seller") {
      return next();
    }

    req.sellerData = sessionData;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { sellerMiddleware, SellerToken };
