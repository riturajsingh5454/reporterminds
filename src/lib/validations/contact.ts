import { z } from "zod";

export const contactRequestSchema = z.object({
  type: z.enum(["GENERAL", "MEETING", "SPEAKING", "MEDIA_INQUIRY"]),
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
