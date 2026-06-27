import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: Role;
};

const ALG = "HS256";
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_COOKIE_NAME = "rm_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_COOKIE_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email as string,
      name: (payload.name as string) ?? "",
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_MAX_AGE_SECONDS };
