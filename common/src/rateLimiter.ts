import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { logger } from "./logger";
import { ApiError } from "./errorHandler";
import { ERROR_CODES } from "./errorUtils";

interface RateLimiterOptions {
  redisClient?: Redis;
  redisUrl?: string;
  jwtSecret: string;
  maxRequests: number;
  windowSeconds: number;
  source: string;
}

export class RateLimiter {
  private redis: Redis;
  private jwtSecret: string;
  private maxRequests: number;
  private windowSeconds: number;
  private source: string;

  private luaScript = `
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

  constructor(options: RateLimiterOptions) {
    if (!options.source || options.source.trim() === "") {
      throw new Error("The 'source' option is required and cannot be empty.");
    }

    if (!Number.isInteger(options.maxRequests) || options.maxRequests <= 0) {
      throw new Error("'maxRequests' must be a positive integer.");
    }

    if (
      !Number.isInteger(options.windowSeconds) ||
      options.windowSeconds <= 0
    ) {
      throw new Error("'windowSeconds' must be a positive integer.");
    }

    if (!options.jwtSecret || options.jwtSecret.trim() === "") {
      throw new Error(
        "The 'jwtSecret' option is required and cannot be empty."
      );
    }

    if (options.redisClient) {
      this.redis = options.redisClient;
    } else if (options.redisUrl) {
      this.redis = new Redis(options.redisUrl);
    } else {
      throw new Error(
        "You must provide a redisClient or a redisUrl in RateLimiterOptions."
      );
    }

    this.addListeners();

    this.source = options.source;

    this.jwtSecret = options.jwtSecret;
    this.maxRequests = options.maxRequests ?? 100;
    this.windowSeconds = options.windowSeconds ?? 60;
    this.middlewareJwt = this.middlewareJwt.bind(this);
    this.middlewareIp = this.middlewareIp.bind(this);
  }

  private addListeners() {
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

    this.redis.on("reconnecting", (time: any) => {
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

  private verifyToken(req: Request): string | null {
    try {
      const token = req.session?.jwt;
      if (!token) return null;
      const agent = jwt.verify(token, this.jwtSecret) as { id?: string };
      return agent?.id || null;
    } catch {
      return null;
    }
  }

  /** Express rateLimitJwt middleware */
  middlewareJwt() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const agentId = this.verifyToken(req);

        if (!agentId) {
          return next(
            new ApiError(401, "Invalid session or token", {
              code: ERROR_CODES.UNAUTHORIZED,
            })
          );
        }

        const key = `ratelimit:${this.source}:agent:${agentId}`;

        const result = await this.redis.eval(
          this.luaScript,
          1,
          key,
          this.maxRequests,
          this.windowSeconds
        );

        if (result === 0) {
          return next(
            new ApiError(429, "Too many requests, try again later", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            })
          );
        }

        return next();
      } catch (error) {
        return next(
          new ApiError(503, "Service temporarily unavailable", {
            code: ERROR_CODES.SERVICE_UNAVAILABLE,
          })
        );
      }
    };
  }

  /** Express middlewareIp middleware */
  middlewareIp() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const ip = req.publicAddress;

        const key = `ratelimit:${this.source}:ip:${ip}`;

        const result = await this.redis.eval(
          this.luaScript,
          1,
          key,
          this.maxRequests,
          this.windowSeconds
        );

        if (result === 0) {
          return next(
            new ApiError(429, "Too many requests from this IP", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            })
          );
        }

        return next();
      } catch (error) {
        return next(
          new ApiError(503, "Service temporarily unavailable", {
            code: ERROR_CODES.SERVICE_UNAVAILABLE,
          })
        );
      }
    };
  }

  /** GraphQL checkId */
  public async checkId(agentId: string): Promise<boolean> {
    try {
      const key = `ratelimit:${this.source}:agent:${agentId}`;

      const result = await this.redis.eval(
        this.luaScript,
        1,
        key,
        this.maxRequests,
        this.windowSeconds
      );

      if (result === 0) {
        logger.warn({
          service: this.source,
          event: "ratelimit.exceeded",
          message: "ratelimit exceeded by agent",
          agentId,
        });
      }

      return result !== 0;
    } catch (error) {
      logger.error({
        service: this.source,
        event: "ratelimit.error",
        message: "ratelimit error",
        error: error,
      });

      return false;
    }
  }

  /** GraphQL checkIp */
  public async checkIp(ip: string): Promise<boolean> {
    try {
      const key = `ratelimit:${this.source}:ip:${ip}`;

      const result = await this.redis.eval(
        this.luaScript,
        1,
        key,
        this.maxRequests,
        this.windowSeconds
      );

      if (result === 0) {
        logger.warn({
          service: this.source,
          event: "ratelimit.exceeded",
          message: "ratelimit exceeded by ip",
          ip,
        });
      }

      return result !== 0;
    } catch (error) {
      logger.error({
        service: this.source,
        event: "ratelimit.error",
        message: "ratelimit error",
        error,
      });

      return false;
    }
  }
}
