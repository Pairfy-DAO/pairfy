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
}
export declare const sellerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
