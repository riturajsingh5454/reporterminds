import "server-only";
import { cookies } from "next/headers";
import {
  signAuthToken,
  verifyAuthToken,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
  type AuthTokenPayload,
} from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export { SESSION_COOKIE_NAME };

export async function createSession(payload: AuthTokenPayload) {
  const token = await signAuthToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const claims = await verifyAuthToken(token);
  if (!claims) return null;

  // The token only proves who logged in. Re-check the user so that deactivated, deleted,
  // demoted or password-reset accounts lose access immediately instead of after 7 days.
  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: { email: true, name: true, role: true, isActive: true, updatedAt: true },
  });
  if (!user || !user.isActive) return null;
  if (claims.iat < Math.floor(user.updatedAt.getTime() / 1000)) return null;

  return { sub: claims.sub, email: user.email, name: user.name, role: user.role };
}
