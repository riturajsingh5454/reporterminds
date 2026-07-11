"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Save an uploaded file to the public/uploads directory.
 * Returns the public URL path (e.g. "/uploads/17200000000-abc123.jpg").
 *
 * @param file - The File object from FormData
 * @param existingUrl - Optional existing URL to fall back to (for updates)
 * @returns The public URL path of the saved file
 * @throws If no file and no existingUrl, or file exceeds 2MB, or file is not an image
 */
export async function saveUploadedFile(file: File | null, existingUrl?: string): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    if (existingUrl) return existingUrl;
    throw new Error("No file uploaded or file is empty");
  }

  // Validate file size (max 2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size must not exceed 2MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const fileExtension = file.name.split(".").pop() || "jpg";
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);

  return `/uploads/${uniqueFilename}`;
}
