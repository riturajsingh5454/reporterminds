import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Wraps any Prisma call and returns a fallback value on connection/DNS errors.
 * This prevents pages from throwing a 500 when the database is temporarily
 * unreachable (e.g. Atlas cluster paused, DNS issue, cold start).
 *
 * Usage:
 *   const books = await safeQuery(() => prisma.book.findMany(), []);
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Catch connection-level errors — DNS failure, timeout, auth failure.
    const isConnectError =
      message.includes("DNS resolution") ||
      message.includes("no record found") ||
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT") ||
      message.includes("connect ECONNREFUSED") ||
      message.includes("Error creating a database connection") ||
      message.includes("Server selection timeout");

    if (isConnectError) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[ReportersMind] Database unreachable — returning fallback data.\n" +
            "Fix: Resume your MongoDB Atlas cluster at https://cloud.mongodb.com\n" +
            `Detail: ${message.slice(0, 120)}`,
        );
      }
      return fallback;
    }
    // Re-throw anything that isn't a connectivity error.
    throw err;
  }
}
