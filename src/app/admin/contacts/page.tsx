import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { ContactStatusSelect } from "@/components/admin/contact-status-select";
import { deleteContactRequest, bulkDeleteContactRequests } from "@/server/actions/contact-requests";

export const metadata: Metadata = { title: "Contact Requests" };
const PAGE_SIZE = 20;

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [items, total] = await Promise.all([
    prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactRequest.count(),
  ]);

  const formattedRows = items.map((c) => ({
    id: c.id,
    from: (
      <div>
        <p className="font-medium">{c.name}</p>
        <p className="text-muted-foreground text-xs">{c.email}</p>
      </div>
    ),
    type: <Badge variant="outline">{c.type.replace("_", " ")}</Badge>,
    message: <p className="max-w-xs truncate text-sm">{c.message}</p>,
    received: new Date(c.createdAt).toLocaleDateString(),
    status: <ContactStatusSelect id={c.id} status={c.status} />,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Contact Requests</h1>
        <p className="text-muted-foreground text-sm">General, meeting, speaking, and media inquiries.</p>
      </div>

      <DataTable
        rows={formattedRows}
        onDelete={deleteContactRequest}
        onBulkDelete={bulkDeleteContactRequests}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePagePath="/admin/contacts"
        columns={[
          { header: "From", accessor: "from" },
          { header: "Type", accessor: "type" },
          { header: "Message", accessor: "message" },
          { header: "Received", accessor: "received" },
          { header: "Status", accessor: "status" },
        ]}
      />
    </div>
  );
}
