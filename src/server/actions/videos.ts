"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { videoSchema } from "@/lib/validations/video";
import type { ActionResult } from "@/server/actions/books";

function parseVideoForm(formData: FormData) {
  return videoSchema.safeParse({
    youtubeId: formData.get("youtubeId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    thumbnail: formData.get("thumbnail") || undefined,
    publishedAt: formData.get("publishedAt"),
    durationSec: formData.get("durationSec") || undefined,
    category: formData.get("category") || undefined,
    playlistId: formData.get("playlistId") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
  });
}

export async function createVideo(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { playlistId, ...rest } = parsed.data;
  await prisma.video.create({
    data: {
      ...rest,
      thumbnail: rest.thumbnail || `https://i.ytimg.com/vi/${rest.youtubeId}/hqdefault.jpg`,
      publishedAt: new Date(rest.publishedAt),
      playlistId: playlistId || undefined,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}

export async function updateVideo(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { playlistId, ...rest } = parsed.data;
  await prisma.video.update({
    where: { id },
    data: {
      ...rest,
      thumbnail: rest.thumbnail || `https://i.ytimg.com/vi/${rest.youtubeId}/hqdefault.jpg`,
      publishedAt: new Date(rest.publishedAt),
      playlistId: playlistId || null,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}

export async function bulkDeleteVideos(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.video.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}
