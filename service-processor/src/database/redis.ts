import type { RedisOptions } from 'ioredis';

export const connection: RedisOptions = {
  host: process.env.REDIS_PROCESSOR_HOST as string,
  port: 6379,
  maxRetriesPerRequest: null,
};
