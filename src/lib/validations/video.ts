import { z } from "zod";

export const videoSchema = z.object({
  youtubeId: z.string().trim().min(1, "YouTube video ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  thumbnail: z.string().trim().optional(),
  publishedAt: z.string().trim().min(1, "Published date is required"),
  durationSec: z.coerce.number().int().optional(),
  category: z.string().trim().optional(),
  playlistId: z.string().trim().optional(),
  viewCount: z.coerce.number().int().min(0).default(0),
  isFeatured: z.coerce.boolean().optional(),
});

export type VideoInput = z.infer<typeof videoSchema>;
