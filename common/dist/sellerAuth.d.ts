import { Request, Response, NextFunction } from "express";
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
export declare const sellerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const sellerRequired: (req: Request, _res: Response, next: NextFunction) => void;
