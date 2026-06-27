import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteUser } from "@/server/actions/users";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  const formattedRows = users.map((u) => ({
    id: u.id,
    editHref: `/admin/users/${u.id}/edit`,
    name: (
      <div>
        <p className="font-medium">{u.name}</p>
        <p className="text-muted-foreground text-xs">{u.email}</p>
      </div>
    ),
    role: <Badge variant="outline">{u.role.replace("_", " ")}</Badge>,
    status: u.isActive ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Users</h1>
        <p className="text-muted-foreground text-sm">Manage admin and editor accounts.</p>
      </div>

      <DataTable
        rows={formattedRows}
        newHref="/admin/users/new"
        onDelete={deleteUser}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Role", accessor: "role" },
          { header: "Status", accessor: "status" },
        ]}
      />
    </div>
  );
}
