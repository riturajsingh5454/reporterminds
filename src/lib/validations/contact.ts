import { z } from "zod";

export const contactRequestSchema = z.object({
  type: z.enum(["GENERAL", "MEETING", "SPEAKING", "MEDIA_INQUIRY"]),
  name: z.string().trim().min(2, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(254, "Email is too long"),
  phone: z.string().trim().max(30, "Phone number is too long").optional(),
  subject: z.string().trim().max(200, "Subject is too long").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
