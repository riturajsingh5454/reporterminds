import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required"),
  tagline: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  heroMedia: z.string().trim().optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  yearsExperience: z.coerce.number().int().optional(),
  studentsMentored: z.coerce.number().int().optional(),
  youtubeChannelId: z.string().trim().optional(),
  analyticsId: z.string().trim().optional(),
  maintenanceMode: z.coerce.boolean().optional(),
  twitter: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
