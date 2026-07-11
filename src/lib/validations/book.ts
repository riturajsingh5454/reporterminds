import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  subtitle: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  galleryImages: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required"),
  isbn: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  publishedYear: z.coerce.number().int().optional(),
  language: z.string().trim().optional(),
  pages: z.coerce.number().int().optional(),
  price: z.coerce.number().optional(),
  category: z.string().trim().optional(),
  amazonUrl: z.string().trim().optional(),
  flipkartUrl: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export type BookInput = z.infer<typeof bookSchema>;
