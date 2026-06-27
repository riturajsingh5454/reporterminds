import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { deleteVideo, bulkDeleteVideos } from "@/server/actions/videos";

export const metadata: Metadata = { title: "Videos" };
const PAGE_SIZE = 15;

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.video.count({ where }),
  ]);

  const formattedRows = videos.map((v) => ({
    id: v.id,
    editHref: `/admin/videos/${v.id}/edit`,
    title: <span className="font-medium">{v.title}</span>,
    category: v.category ?? "—",
    views: v.viewCount.toLocaleString(),
    published: new Date(v.publishedAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Videos</h1>
        <p className="text-muted-foreground text-sm">Manage the YouTube Hub video library.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/videos/new"
        onDelete={deleteVideo}
        onBulkDelete={bulkDeleteVideos}
        searchAction="/admin/videos"
        searchDefaultValue={q}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/videos"
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Category", accessor: "category" },
          { header: "Views", accessor: "views" },
          { header: "Published", accessor: "published" },
        ]}
      />
    </div>
  );
}
