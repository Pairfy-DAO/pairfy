import { Request, Response, NextFunction } from "express";
import { SellerToken, UserToken } from "@pairfy/common";
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
  
  console.log(ip)

  if (!ip) {
    console.warn('IP no detectada');
    return res.status(403).json({ error: 'IP no detectada' });
  }

  // Limpiar IP embebida en IPv6
  ip = ip.replace(/^::ffff:/, '');

  req.publicAddress = ip;
  next();
};