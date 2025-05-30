import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
interface RateLimiterOptions {
    redisClient?: Redis;
    redisUrl?: string;
    jwtSecret: string;
    maxRequests: number;
    windowSeconds: number;
    source: string;
}
export declare class RateLimiter {
    private redis;
    private jwtSecret;
    private maxRequests;
    private windowSeconds;
    private source;
    private luaScript;
    constructor(options: RateLimiterOptions);
    private addListeners;
    private verifyToken;
    /** Express rateLimitJwt middleware */
    middlewareJwt(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /** Express middlewareIp middleware */
    middlewareIp(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /** GraphQL checkId */
    checkId(agentId: string): Promise<boolean>;
    /** GraphQL checkIp */
    checkIp(ip: string): Promise<boolean>;
}
export {};
