import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteTestimonial, bulkDeleteTestimonials } from "@/server/actions/testimonials";

export const metadata: Metadata = { title: "Testimonials" };
const PAGE_SIZE = 15;

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [items, total] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.testimonial.count(),
  ]);

  const formattedRows = items.map((t) => ({
    id: t.id,
    editHref: `/admin/testimonials/${t.id}/edit`,
    author: <span className="font-medium">{t.authorName}</span>,
    category: <Badge variant="outline">{t.category}</Badge>,
    type: t.type,
    featured: t.isFeatured ? "Yes" : "No",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Testimonials</h1>
        <p className="text-muted-foreground text-sm">Manage student and professional testimonials.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/testimonials/new"
        onDelete={deleteTestimonial}
        onBulkDelete={bulkDeleteTestimonials}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/testimonials"
        columns={[
          { header: "Author", accessor: "author" },
          { header: "Category", accessor: "category" },
          { header: "Type", accessor: "type" },
          { header: "Featured", accessor: "featured" },
        ]}
      />
    </div>
  );
}
