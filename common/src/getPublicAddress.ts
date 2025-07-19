import { Request, Response, NextFunction } from "express";
import { logger, SellerToken, UserToken } from "./index.js";
import requestIp from 'request-ip';

declare global {
  namespace Express {
    interface Request {
      publicAddress?: string;
      sellerData?: SellerToken;
      userData: UserToken;
      session?:
      | {
        jwt?: string;
        [key: string]: any;
      }
      | null
      | undefined;
    }
  }
}


export const getPublicAddress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let ip = requestIp.getClientIp(req);

  if (!ip) {
    logger.warn({
      message: 'Public IP not detected',
      event: 'operational',
      service: req.originalUrl,
      method: req.method
    });

    res.status(403).json({ error: 'Public IP not detected' });
    return;
  }

  const cleanedIp = ip.replace(/^::ffff:/, '');
  req.publicAddress = cleanedIp;

  logger.info({
    message: 'Public IP detected',
    event: 'operational',
    service: req.originalUrl,
    method: req.method,
    ip: cleanedIp
  });

  next();
};