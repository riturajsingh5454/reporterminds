"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { siteSettingsSchema } from "@/lib/validations/settings";
import type { ActionResult } from "@/server/actions/books";

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    heroMedia: formData.get("heroMedia") || undefined,
    contactEmail: formData.get("contactEmail") || "",
    yearsExperience: formData.get("yearsExperience") || undefined,
    studentsMentored: formData.get("studentsMentored") || undefined,
    articlesPublished: formData.get("articlesPublished") || undefined,
    booksPublished: formData.get("booksPublished") || undefined,
    videosCreated: formData.get("videosCreated") || undefined,
    youtubeChannelId: formData.get("youtubeChannelId") || undefined,
    analyticsId: formData.get("analyticsId") || undefined,
    maintenanceMode: formData.get("maintenanceMode") === "on",

    linkedin: formData.get("linkedin") || undefined,
    youtube: formData.get("youtube") || undefined,
    instagram: formData.get("instagram") || undefined,
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const {  linkedin, youtube, instagram, ...rest } = parsed.data;
  const socialLinks = { linkedin, youtube, instagram };

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: { ...rest, socialLinks } });
  } else {
    await prisma.siteSettings.create({ data: { ...rest, socialLinks } });
  }

  revalidatePath("/", "layout");
  return { success: true };
}
