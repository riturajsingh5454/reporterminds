import "server-only";
import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory fixed-window rate limiter. Good enough for a single-instance
 * deployment; swap for a shared store (e.g. Upstash Redis) once running multi-instance.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true };
}
