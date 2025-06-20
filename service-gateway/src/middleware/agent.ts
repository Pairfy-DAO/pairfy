import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { logger, SellerToken } from "@pairfy/common";


export interface UserToken {
  pubkeyhash: string;
  role: string;
  address: string;
  country: string;
  username: string;
}

declare global {
  interface Request {
    sellerData?: SellerToken;
  }
}

declare global {
  interface Request {
    userData?: UserToken;
  }
}


export const agentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const privateKey = Buffer.from(process.env.AGENT_JWT_KEY!, 'base64').toString('utf-8');

    const sessionData = jwt.verify(
      req.session.jwt,
      privateKey
    ) as any;

    if (sessionData.role === "SELLER") {
      req.sellerData = {
        ...sessionData,
        token: req.session.jwt,
      };

      return next();
    }

    if (sessionData.role === "USER") {
      req.userData = {
        ...sessionData,
        token: req.session.jwt,
      };

      return next();
    }
  } catch (err) {
    logger.error(err);
  }

 return next();
};

