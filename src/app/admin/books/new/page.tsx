import type { Metadata } from "next";
import { BookForm } from "@/components/admin/forms/book-form";

export const metadata: Metadata = { title: "New Book" };

export default function NewBookPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">New Book</h1>
        <p className="text-muted-foreground text-sm">Add a new book to the catalog.</p>
      </div>
      <BookForm />
    </div>
  );
}
