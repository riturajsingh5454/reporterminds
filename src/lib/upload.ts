"use server";

import { prisma } from "@/lib/prisma";

/**
 * Save an uploaded file to MongoDB as base64.
 * Returns the public URL path (e.g. "/api/uploads/abc123").
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

  // Validate file size (max 1MB)
  const MAX_SIZE = 1 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size must not exceed 1MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Data = buffer.toString("base64");

  // Store in MongoDB
  const upload = await prisma.upload.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: base64Data,
    },
  });

  return `/api/uploads/${upload.id}`;
}
