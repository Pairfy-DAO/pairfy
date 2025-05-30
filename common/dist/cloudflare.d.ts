import { RequestHandler } from "express";
import { SellerToken } from "./sellerAuth";
declare global {
    namespace Express {
        interface Request {
            publicAddress?: string;
            sellerData?: SellerToken;
            session?: {
                jwt?: string;
                [key: string]: any;
            } | null | undefined;
        }
    }
}
export declare const CLOUDFLARE_IP_RANGES: string[];
export declare const getPublicAddress: RequestHandler;
