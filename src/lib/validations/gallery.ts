import { z } from "zod";

export const galleryItemSchema = z.object({
  imageUrl: z.string().trim().min(1, "Image URL is required"),
  caption: z.string().trim().optional(),
  categoryId: z.string().trim().min(1, "Category is required"),
  width: z.coerce.number().int().optional(),
  height: z.coerce.number().int().optional(),
  eventName: z.string().trim().optional(),
  location: z.string().trim().optional(),
  order: z.coerce.number().int().default(0),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
