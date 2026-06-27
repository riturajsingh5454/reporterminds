import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/forms/article-form";

export const metadata: Metadata = { title: "New Article" };

export default async function NewArticlePage() {
  const categories = await prisma.articleCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">New Article</h1>
        <p className="text-muted-foreground text-sm">Write a new blog post or column.</p>
      </div>
      <ArticleForm categories={categories} />
    </div>
  );
}
