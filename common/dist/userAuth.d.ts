import { Request, Response, NextFunction } from "express";
export interface UserToken {
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
export declare const userMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const userRequiredMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
