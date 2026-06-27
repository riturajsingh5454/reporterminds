import "server-only";
import type { Role } from "@prisma/client";
import { getSession } from "@/lib/auth/session";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

const roleRank: Record<Role, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

/** Throws if there is no session, or the session's role is below `minRole`. */
export async function requireRole(minRole: Role) {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  if (roleRank[session.role] < roleRank[minRole]) throw new ForbiddenError();
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
