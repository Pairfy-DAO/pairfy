import { ApiError, ERROR_CODES, logger } from "./index";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserToken {
  pubkeyhash: string;
  role: string;
  address: string;
  wallet_name: string;
  country: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      userData: UserToken;
    }
  }
}

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.AGENT_JWT_KEY!
    ) as UserToken;

    if (sessionData.role === "USER") {
      const scheme = {
        ...sessionData,
        token: req.session.jwt,
      };

      req.userData = scheme;
    }
  } catch (err) {
    logger.error(err);
  }

  return next();
};


export const userRequiredMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.userData) {
    return next(
      new ApiError(401, "Unauthorized", {
        code: ERROR_CODES.UNAUTHORIZED,
      })
    );
  }
  next();
};