import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/forms/article-form";

export const metadata: Metadata = { title: "Edit Article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();

  const articleTags = await prisma.tag.findMany({ where: { id: { in: article.tagIds } } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Article</h1>
        <p className="text-muted-foreground text-sm">{article.title}</p>
      </div>
      <ArticleForm article={article} categories={categories} articleTags={articleTags} />
    </div>
  );
}
