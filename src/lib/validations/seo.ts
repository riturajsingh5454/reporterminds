import { z } from "zod";

export const seoSettingsSchema = z.object({
  path: z.string().trim().min(1, "Path is required").regex(/^\//, "Path must start with /"),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  ogImage: z.string().trim().optional(),
});

export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
