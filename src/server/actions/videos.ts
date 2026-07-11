"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { videoSchema } from "@/lib/validations/video";
import type { ActionResult } from "@/server/actions/books";

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return trimmed;
}

function parseVideoForm(formData: FormData) {
  const youtubeIdInput = String(formData.get("youtubeId") ?? "");
  const youtubeId = extractYoutubeId(youtubeIdInput);

  return videoSchema.safeParse({
    youtubeId,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    thumbnail: formData.get("thumbnail") || undefined,
    publishedAt: formData.get("publishedAt"),
    durationSec: formData.get("durationSec") || undefined,
    viewCount: formData.get("viewCount") || 0,
    category: formData.get("category") || undefined,
    playlistId: formData.get("playlistId") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
  });
}

function resolveThumbnailUrl(thumbnailInput: string | undefined, youtubeId: string): string {
  if (!thumbnailInput) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  const trimmed = thumbnailInput.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return `https://i.ytimg.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return trimmed;
}

export async function createVideo(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { playlistId, ...rest } = parsed.data;
  await prisma.video.create({
    data: {
      ...rest,
      thumbnail: resolveThumbnailUrl(rest.thumbnail, rest.youtubeId),
      publishedAt: new Date(rest.publishedAt),
      playlistId: playlistId || undefined,
    },
  });

  revalidatePath("/");
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
      thumbnail: resolveThumbnailUrl(rest.thumbnail, rest.youtubeId),
      publishedAt: new Date(rest.publishedAt),
      playlistId: playlistId || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.video.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}

export async function bulkDeleteVideos(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.video.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath("/youtube");
  return { success: true };
}
