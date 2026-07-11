"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { siteSettingsSchema } from "@/lib/validations/settings";
import { saveUploadedFile } from "@/lib/upload";
import type { ActionResult } from "@/server/actions/books";

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  await requireRole("ADMIN");

  // Handle logo file upload
  const logoFile = formData.get("logoFile") as File | null;
  const existing = await prisma.siteSettings.findFirst();
  let logoUrl = existing?.logoUrl ?? undefined;
  if (logoFile && logoFile instanceof File && logoFile.size > 0) {
    try {
      logoUrl = await saveUploadedFile(logoFile);
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to upload logo" };
    }
  }

  // Handle hero media file upload
  const heroMediaFile = formData.get("heroMediaFile") as File | null;
  let heroMedia = existing?.heroMedia ?? undefined;
  if (heroMediaFile && heroMediaFile instanceof File && heroMediaFile.size > 0) {
    try {
      heroMedia = await saveUploadedFile(heroMediaFile);
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to upload hero media" };
    }
  }

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline") || undefined,
    logoUrl: logoUrl || undefined,
    heroMedia: heroMedia || undefined,
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

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: { ...rest, socialLinks } });
  } else {
    await prisma.siteSettings.create({ data: { ...rest, socialLinks } });
  }

  revalidatePath("/", "layout");
  return { success: true };
}
