import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export const createCache = async (): Promise<Redis> => {
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }
  return client;
};
