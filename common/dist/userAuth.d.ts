import { Request, Response, NextFunction } from "express";
export interface UserToken {
    id: string;
    pubkeyhash: string;
    role: string;
    address: string;
    wallet_name: string;
    country: string;
    username: string;
    rsa_version: string;
    rsa_public_key: string;
}
declare global {
    namespace Express {
        interface Request {
            userData: UserToken;
        }
    }
}
export declare const userMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const userRequiredMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
