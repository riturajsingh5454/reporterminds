import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { deleteGalleryItem, bulkDeleteGalleryItems } from "@/server/actions/gallery";

export const metadata: Metadata = { title: "Gallery" };
const PAGE_SIZE = 20;

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [items, total] = await Promise.all([
    prisma.gallery.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.gallery.count(),
  ]);

  const formattedRows = items.map((g) => ({
    id: g.id,
    editHref: `/admin/gallery/${g.id}/edit`,
    preview: (
      <div className="relative size-12 overflow-hidden rounded-md border border-border/60">
        <Image src={g.imageUrl} alt={g.caption ?? ""} fill unoptimized className="object-cover" />
      </div>
    ),
    caption: g.caption ?? "—",
    category: g.category.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Gallery</h1>
        <p className="text-muted-foreground text-sm">Manage photo gallery items.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/gallery/new"
        onDelete={deleteGalleryItem}
        onBulkDelete={bulkDeleteGalleryItems}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/gallery"
        columns={[
          { header: "Preview", accessor: "preview" },
          { header: "Caption", accessor: "caption" },
          { header: "Category", accessor: "category" },
        ]}
      />
    </div>
  );
}
