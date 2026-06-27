import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
  bio: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
  bio: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
