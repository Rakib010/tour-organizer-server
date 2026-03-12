/*
 * tour-server previous Redis implementation (kept for reference, not removed)
 *
 * import { createClient } from 'redis';
 * import { envVars } from './env';
 *
 * export const redisClient = createClient({
 *     username: envVars.REDIS_USERNAME,
 *     password: envVars.REDIS_PASSWORD,
 *     socket: {
 *         host: envVars.REDIS_HOST,
 *         port: Number(envVars.REDIS_PORT)
 *     }
 * });
 *
 * redisClient.on('error', err => console.log('Redis Client Error', err));
 *
 * export const connectRedis = async () => {
 *     if (!redisClient.open) {
 *         await redisClient.connect();
 *         console.log("Redis Connected")
 *     }
 * }
 */

/* eslint-disable no-console */
import { createClient, RedisClientType } from "redis";
import { envVars } from "./env";

let redisClient: RedisClientType;
export let isRedisConnected = false;

// In-memory fallback store for OTP when Redis is unavailable (development only)
const memoryStore = new Map<string, { value: string; expiry: number }>();

export const getRedisClient = () => redisClient;

const REDIS_CONNECT_TIMEOUT_MS = 5000;

export const connectRedis = async (): Promise<void> => {
  redisClient = createClient({
    username: envVars.REDIS_USERNAME || undefined,
    password: envVars.REDIS_PASSWORD || undefined,
    socket: {
      host: envVars.REDIS_HOST,
      port: Number(envVars.REDIS_PORT),
      connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
    },
  });

  redisClient.on("error", (err) => {
    if (isRedisConnected) console.log("Redis Client Error:", err.message);
  });

  try {
    if (!redisClient.isOpen) {
      await Promise.race([
        redisClient.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Redis connection timeout")), REDIS_CONNECT_TIMEOUT_MS),
        ),
      ]);
      isRedisConnected = true;
      console.log("Redis Connected");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Redis connection failed:", message);
    console.warn("Using in-memory fallback for OTP. For production, ensure Redis is available.");
    redisClient = null as unknown as RedisClientType;
  }
};

/** Get value - uses Redis if connected, otherwise in-memory fallback */
export const getCache = async (key: string): Promise<string | null> => {
  if (isRedisConnected && redisClient) {
    return redisClient.get(key);
  }
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
};

/** Set value with TTL (seconds) - uses Redis if connected, otherwise in-memory fallback */
export const setCache = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
  if (isRedisConnected && redisClient) {
    await redisClient.set(key, value, { EX: ttlSeconds });
    return;
  }
  memoryStore.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
};

/** Delete key - uses Redis if connected, otherwise in-memory fallback */
export const deleteCache = async (key: string): Promise<void> => {
  if (isRedisConnected && redisClient) {
    await redisClient.del([key]);
    return;
  }
  memoryStore.delete(key);
};