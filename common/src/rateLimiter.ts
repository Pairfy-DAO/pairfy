import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

interface RateLimiterOptions {
  redisClient: Redis;
  jwtSecret: string;
  maxRequests: number;
  windowSeconds: number;
}

export class RateLimiterJWT {
  private redis: Redis;
  private jwtSecret: string;
  private maxRequests: number;
  private windowSeconds: number;

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
    this.redis = options.redisClient;
    this.jwtSecret = options.jwtSecret;
    this.maxRequests = options.maxRequests;
    this.windowSeconds = options.windowSeconds;
  }

  /**
   * Express middleware para limitar solicitudes por usuario autenticado con JWT.
   */
  public middleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.session?.jwt;
      if (!token) {
        return res.status(401).json({ error: "No se proporcionó token JWT" });
      }

      const agent = jwt.verify(token, this.jwtSecret) as { id?: string };
      if (!agent?.id) {
        return res.status(401).json({ error: "Usuario inválido" });
      }

      const key = `ratelimit:agent:${agent.id}`;

      const result = await this.redis.eval(
        this.luaScript,
        1,
        key,
        this.maxRequests,
        this.windowSeconds
      );

      if (result === 0) {
        return res
          .status(429)
          .json({ error: "Demasiadas solicitudes, intenta más tarde" });
      }

      return next();
    } catch (error) {
      console.error("Error en RateLimiter:", error);
      return res
        .status(503)
        .json({ error: "Servicio no disponible. Intenta más tarde." });
    }
  };

  public async check(agentId: string): Promise<boolean> {
    const key = `ratelimit:agent:${agentId}`;

    const result = await this.redis.eval(
      this.luaScript,
      1,
      key,
      this.maxRequests,
      this.windowSeconds
    );
    return result !== 0;
  }
}
