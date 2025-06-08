"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("./logger");
const errorHandler_1 = require("./errorHandler");
const errorUtils_1 = require("./errorUtils");
class RateLimiter {
    constructor(options) {
        this.luaScript = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])

    local current = tonumber(redis.call("GET", key) or "0")
    if current + 1 > limit then
      return 0
    else
      current = redis.call("INCR", key)
      if current == 1 then
        redis.call("EXPIRE", key, window)
      end
      return current
    end
  `;
        if (!options.source || options.source.trim() === "") {
            throw new Error("The 'source' option is required and cannot be empty.");
        }
        if (!Number.isInteger(options.maxRequests) || options.maxRequests <= 0) {
            throw new Error("'maxRequests' must be a positive integer.");
        }
        if (!Number.isInteger(options.windowSeconds) ||
            options.windowSeconds <= 0) {
            throw new Error("'windowSeconds' must be a positive integer.");
        }
        if (!options.jwtSecret || options.jwtSecret.trim() === "") {
            throw new Error("The 'jwtSecret' option is required and cannot be empty.");
        }
        if (options.redisClient) {
            this.redis = options.redisClient;
        }
        else if (options.redisUrl) {
            this.redis = new ioredis_1.default(options.redisUrl);
        }
        else {
            throw new Error("You must provide a redisClient or a redisUrl in RateLimiterOptions.");
        }
        this.addListeners();
        this.source = options.source;
        const privateKey = Buffer.from(options.jwtSecret, 'base64').toString('utf-8');
        this.jwtSecret = privateKey;
        this.maxRequests = options.maxRequests ?? 100;
        this.windowSeconds = options.windowSeconds ?? 60;
        this.middlewareJwt = this.middlewareJwt.bind(this);
        this.middlewareIp = this.middlewareIp.bind(this);
    }
    addListeners() {
        this.redis.on("error", (error) => {
            console.error({
                service: this.source,
                event: "redis.error",
                message: "redis listener error",
                error,
            });
        });
        this.redis.on("close", () => {
            console.warn({
                service: this.source,
                event: "redis.close",
                message: "redis close event",
            });
        });
        this.redis.on("reconnecting", (time) => {
            console.info({
                service: this.source,
                event: "redis.reconnecting",
                message: `[Redis]: retrying connection in ${time}ms`,
            });
        });
        this.redis.on("end", () => {
            console.warn({
                service: this.source,
                event: "redis.end",
                message: "ratelimit redis end event",
            });
        });
    }
    verifyToken(req) {
        try {
            const token = req.session?.jwt;
            if (!token)
                return null;
            const agent = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return agent?.id || null;
        }
        catch {
            return null;
        }
    }
    /** Express rateLimitJwt middleware */
    middlewareJwt() {
        return async (req, res, next) => {
            try {
                const agentId = this.verifyToken(req);
                if (!agentId) {
                    return next(new errorHandler_1.ApiError(401, "Invalid session or token", {
                        code: errorUtils_1.ERROR_CODES.UNAUTHORIZED,
                    }));
                }
                const key = `ratelimit:${this.source}:agent:${agentId}`;
                const result = await this.redis.eval(this.luaScript, 1, key, this.maxRequests, this.windowSeconds);
                if (result === 0) {
                    return next(new errorHandler_1.ApiError(429, "Too many requests, try again later", {
                        code: errorUtils_1.ERROR_CODES.RATE_LIMIT_EXCEEDED,
                    }));
                }
                return next();
            }
            catch (error) {
                return next(new errorHandler_1.ApiError(503, "Service temporarily unavailable", {
                    code: errorUtils_1.ERROR_CODES.SERVICE_UNAVAILABLE,
                }));
            }
        };
    }
    /** Express middlewareIp middleware */
    middlewareIp() {
        return async (req, res, next) => {
            try {
                const ip = req.publicAddress;
                const key = `ratelimit:${this.source}:ip:${ip}`;
                const result = await this.redis.eval(this.luaScript, 1, key, this.maxRequests, this.windowSeconds);
                if (result === 0) {
                    return next(new errorHandler_1.ApiError(429, "Too many requests from this IP", {
                        code: errorUtils_1.ERROR_CODES.RATE_LIMIT_EXCEEDED,
                    }));
                }
                return next();
            }
            catch (error) {
                return next(new errorHandler_1.ApiError(503, "Service temporarily unavailable", {
                    code: errorUtils_1.ERROR_CODES.SERVICE_UNAVAILABLE,
                }));
            }
        };
    }
    /** GraphQL checkId */
    async checkId(agentId) {
        try {
            const key = `ratelimit:${this.source}:agent:${agentId}`;
            const result = await this.redis.eval(this.luaScript, 1, key, this.maxRequests, this.windowSeconds);
            if (result === 0) {
                logger_1.logger.warn({
                    service: this.source,
                    event: "ratelimit.exceeded",
                    message: "ratelimit exceeded by agent",
                    agentId,
                });
            }
            return result !== 0;
        }
        catch (error) {
            logger_1.logger.error({
                service: this.source,
                event: "ratelimit.error",
                message: "ratelimit error",
                error: error,
            });
            return false;
        }
    }
    /** GraphQL checkIp */
    async checkIp(ip) {
        try {
            const key = `ratelimit:${this.source}:ip:${ip}`;
            const result = await this.redis.eval(this.luaScript, 1, key, this.maxRequests, this.windowSeconds);
            if (result === 0) {
                logger_1.logger.warn({
                    service: this.source,
                    event: "ratelimit.exceeded",
                    message: "ratelimit exceeded by ip",
                    ip,
                });
            }
            return result !== 0;
        }
        catch (error) {
            logger_1.logger.error({
                service: this.source,
                event: "ratelimit.error",
                message: "ratelimit error",
                error,
            });
            return false;
        }
    }
}
exports.RateLimiter = RateLimiter;
