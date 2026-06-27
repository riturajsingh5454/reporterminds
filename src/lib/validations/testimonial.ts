import { z } from "zod";

export const testimonialSchema = z.object({
  type: z.enum(["TEXT", "VIDEO"]),
  authorName: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().optional(),
  company: z.string().trim().optional(),
  content: z.string().trim().min(1, "Content is required"),
  videoUrl: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  category: z.enum(["STUDENT", "PROFESSIONAL"]),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isFeatured: z.coerce.boolean().optional(),
  order: z.coerce.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
