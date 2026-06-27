import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteBook, bulkDeleteBooks } from "@/server/actions/books";

export const metadata: Metadata = { title: "Books" };

const PAGE_SIZE = 15;

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
  const [books, total] = await Promise.all([
    prisma.book.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.book.count({ where }),
  ]);

  const formattedRows = books.map((b) => ({
    id: b.id,
    editHref: `/admin/books/${b.id}/edit`,
    title: <span className="font-medium">{b.title}</span>,
    category: b.category ?? "—",
    year: b.publishedYear ?? "—",
    status: <Badge variant={b.status === "PUBLISHED" ? "default" : "secondary"}>{b.status}</Badge>,
    featured: b.isFeatured ? "Yes" : "No",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Books</h1>
        <p className="text-muted-foreground text-sm">Manage published books and editions.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/books/new"
        onDelete={deleteBook}
        onBulkDelete={bulkDeleteBooks}
        searchAction="/admin/books"
        searchDefaultValue={q}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/books"
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Category", accessor: "category" },
          { header: "Year", accessor: "year" },
          { header: "Status", accessor: "status" },
          { header: "Featured", accessor: "featured" },
        ]}
      />
    </div>
  );
}
