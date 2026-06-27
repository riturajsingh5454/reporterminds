import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SeoDialogForm } from "@/components/admin/forms/seo-dialog-form";
import { DeleteSeoButton } from "@/components/admin/forms/delete-seo-button";

export const metadata: Metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const entries = await prisma.sEOSettings.findMany({ orderBy: { path: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">SEO</h1>
          <p className="text-muted-foreground text-sm">Page-level metadata overrides.</p>
        </div>
        <SeoDialogForm />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-10 text-center">
                  No SEO overrides yet.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">{entry.path}</TableCell>
                  <TableCell>{entry.title ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.description ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <SeoDialogForm entry={entry} />
                      <DeleteSeoButton id={entry.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
