import { createClient, RedisClientType } from "redis";

export class RedisWrapper {
  private _client?: RedisClientType;
  service: string = "default";

  get ready() {
    return !!this._client?.isOpen;
  }

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Redis client before connecting");
    }
    return this._client;
  }

  connect(options?: any) {
    this.service = options?.service || "default";

    const redisOptions = { ...options };
    delete redisOptions.service;

    this._client = createClient({
      ...redisOptions,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    this.client.on("connected", () => {
      console.log(`[${this.service}] Redis connected!`);
    });

    this._client.on("reconnecting", () => {
      console.warn(`[${this.service}] Redis reconnecting.`);
    });

    this.client.on("error", (err) => {
      console.error(`[${this.service}] Redis error:`, err.message);
    });

    this.client.on("end", () => {
      console.log(`[${this.service}] Redis closed`);
    });

    return this.client.connect();
  }

  async disconnect() {
    if (this._client?.isOpen) {
      await this._client.quit();
      this._client = undefined;
    }
  }
}
