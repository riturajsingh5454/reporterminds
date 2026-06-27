import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteArchiveItem, bulkDeleteArchiveItems } from "@/server/actions/archive";

export const metadata: Metadata = { title: "Archive" };
const PAGE_SIZE = 15;

export default async function AdminArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
  const [items, total] = await Promise.all([
    prisma.archive.findMany({
      where,
      include: { category: true },
      orderBy: { year: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.archive.count({ where }),
  ]);

  const formattedRows = items.map((a) => ({
    id: a.id,
    editHref: `/admin/archive/${a.id}/edit`,
    title: <span className="font-medium">{a.title}</span>,
    category: a.category.name,
    year: a.year,
    section: <Badge variant="outline">{a.section === "JOURNALISM" ? "Journalism" : "Legacy"}</Badge>,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Archive</h1>
        <p className="text-muted-foreground text-sm">Journalism archive and legacy in print entries.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/archive/new"
        onDelete={deleteArchiveItem}
        onBulkDelete={bulkDeleteArchiveItems}
        searchAction="/admin/archive"
        searchDefaultValue={q}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/archive"
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Category", accessor: "category" },
          { header: "Year", accessor: "year" },
          { header: "Section", accessor: "section" },
        ]}
      />
    </div>
  );
}
