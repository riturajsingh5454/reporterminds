import "server-only";
import { prisma } from "@/lib/prisma";

// SVG and HTML are deliberately excluded: they can carry scripts and are served from our own origin.
export const ALLOWED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
] as const;

const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Save an uploaded file to MongoDB as base64.
 * Returns the public URL path (e.g. "/api/uploads/abc123").
 *
 * This is a plain server-side helper (not a server action): callers must have already
 * authorised the request with `requireRole`.
 *
 * @param file - The File object from FormData
 * @param existingUrl - Optional existing URL to fall back to (for updates)
 * @returns The public URL path of the saved file
 * @throws If no file and no existingUrl, or file exceeds 5MB, or file type is not allowed
 */
export async function saveUploadedFile(file: File | null, existingUrl?: string): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    if (existingUrl) return existingUrl;
    throw new Error("No file uploaded or file is empty");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("File size must not exceed 5MB");
  }

  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    throw new Error("Only PNG, JPEG, WebP, GIF, AVIF images and PDF files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const base64Data = Buffer.from(bytes).toString("base64");

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
