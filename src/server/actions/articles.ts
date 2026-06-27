"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { articleSchema } from "@/lib/validations/article";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import type { ActionResult } from "@/server/actions/books";

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function resolveTagIds(tagsCsv?: string): Promise<string[]> {
  if (!tagsCsv) return [];
  const names = tagsCsv.split(",").map((t) => t.trim()).filter(Boolean);
  const ids: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
    ids.push(tag.id);
  }
  return ids;
}

function parseArticleForm(formData: FormData) {
  return articleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentHtml: formData.get("contentHtml"),
    coverImage: formData.get("coverImage"),
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") || undefined,
    status: formData.get("status"),
    scheduledAt: formData.get("scheduledAt") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    readTimeMins: formData.get("readTimeMins") || 1,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  });
}

export async function createArticle(formData: FormData): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = parseArticleForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { tags, scheduledAt, categoryId, ...rest } = parsed.data;
  const tagIds = await resolveTagIds(tags);

  await prisma.article.create({
    data: {
      ...rest,
      contentHtml: sanitizeArticleHtml(rest.contentHtml),
      categoryId: categoryId || undefined,
      tagIds,
      authorId: session.sub,
      publishedAt: rest.status === "PUBLISHED" ? new Date() : null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateArticle(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseArticleForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { tags, scheduledAt, categoryId, ...rest } = parsed.data;
  const tagIds = await resolveTagIds(tags);
  const existing = await prisma.article.findUnique({ where: { id } });

  await prisma.article.update({
    where: { id },
    data: {
      ...rest,
      contentHtml: sanitizeArticleHtml(rest.contentHtml),
      categoryId: categoryId || null,
      tagIds,
      publishedAt: rest.status === "PUBLISHED" ? existing?.publishedAt ?? new Date() : existing?.publishedAt,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  return { success: true };
}

export async function bulkDeleteArticles(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.article.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  return { success: true };
}
