import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteArticle, bulkDeleteArticles } from "@/server/actions/articles";

export const metadata: Metadata = { title: "Articles" };
const PAGE_SIZE = 15;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);

  const formattedRows = articles.map((a) => ({
    id: a.id,
    editHref: `/admin/articles/${a.id}/edit`,
    title: <span className="font-medium">{a.title}</span>,
    category: a.category?.name ?? "—",
    status: <Badge variant={a.status === "PUBLISHED" ? "default" : "secondary"}>{a.status}</Badge>,
    views: a.viewCount,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Articles</h1>
        <p className="text-muted-foreground text-sm">Manage blog posts and columns.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/articles/new"
        onDelete={deleteArticle}
        onBulkDelete={bulkDeleteArticles}
        searchAction="/admin/articles"
        searchDefaultValue={q}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/articles"
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Category", accessor: "category" },
          { header: "Status", accessor: "status" },
          { header: "Views", accessor: "views" },
        ]}
      />
    </div>
  );
}
