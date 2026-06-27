import type { Metadata } from "next";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteSubscriber, bulkDeleteSubscribers } from "@/server/actions/newsletter";

export const metadata: Metadata = { title: "Newsletter" };
const PAGE_SIZE = 25;

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      orderBy: { subscribedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsletter.count(),
  ]);

  const formattedRows = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    source: s.source ?? "—",
    status: <Badge variant={s.status === "SUBSCRIBED" ? "default" : "secondary"}>{s.status}</Badge>,
    subscribed: new Date(s.subscribedAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Newsletter</h1>
          <p className="text-muted-foreground text-sm">{total} total subscribers.</p>
        </div>
        <Button variant="outline" render={<a href="/api/admin/newsletter/export" />}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <DataTable
        rows={formattedRows}
        onDelete={deleteSubscriber}
        onBulkDelete={bulkDeleteSubscribers}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/newsletter"
        columns={[
          { header: "Email", accessor: "email" },
          { header: "Source", accessor: "source" },
          { header: "Status", accessor: "status" },
          { header: "Subscribed", accessor: "subscribed" },
        ]}
      />
    </div>
  );
}
