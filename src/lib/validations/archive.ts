import { z } from "zod";

export const archiveSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  content: z.string().trim().optional(),
  year: z.coerce.number().int().min(1900).max(2100),
  categoryId: z.string().trim().min(1, "Category is required"),
  publication: z.string().trim().optional(),
  section: z.enum(["JOURNALISM", "LEGACY_PRINT"]),
  attachments: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export type ArchiveInput = z.infer<typeof archiveSchema>;

export function parseAttachmentsField(raw?: string): { url: string; type: string; label: string }[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, type, label] = line.split(",").map((s) => s.trim());
      return { url, type: type || "pdf", label: label || "" };
    });
}

export function formatAttachmentsField(attachments: unknown): string {
  if (!Array.isArray(attachments)) return "";
  return attachments
    .map((a) => {
      const att = a as { url?: string; type?: string; label?: string };
      return [att.url, att.type, att.label].filter(Boolean).join(", ");
    })
    .join("\n");
}
