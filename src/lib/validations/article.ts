import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  contentHtml: z.string().min(1, "Content is required"),
  coverImage: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  scheduledAt: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
  readTimeMins: z.coerce.number().int().min(1).default(1),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
