import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/forms/book-form";

export const metadata: Metadata = { title: "Edit Book" };

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Book</h1>
        <p className="text-muted-foreground text-sm">{book.title}</p>
      </div>
      <BookForm book={book} />
    </div>
  );
}
