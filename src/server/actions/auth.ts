"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type AuthActionResult = { success: true } | { success: false; error: string };

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`login:${ip}`, 10, 5 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many login attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  await createSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
}

export async function requestPasswordResetAction(formData: FormData): Promise<AuthActionResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`forgot-password:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always report success to avoid leaking which emails are registered.
  if (!user) return { success: true };

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { success: true };
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  return { success: true };
}
