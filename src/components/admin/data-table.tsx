"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { PagePagination } from "@/components/shared/page-pagination";

export type DataTableColumn = {
  header: string;
  accessor: string;
  className?: string;
};

export function DataTable<T extends { id: string; editHref?: string; [key: string]: any }>({
  rows,
  columns,
  newHref,
  onDelete,
  onBulkDelete,
  searchPlaceholder = "Search…",
  searchDefaultValue,
  searchAction,
  page,
  totalPages,
  basePagePath,
}: {
  rows: T[];
  columns: DataTableColumn[];
  newHref?: string;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onBulkDelete?: (ids: string[]) => Promise<{ success: boolean; error?: string }>;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  searchAction?: string;
  page?: number;
  totalPages?: number;
  basePagePath?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const allSelected = rows.length > 0 && selected.length === rows.length;

  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.id));
  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleDelete = (id: string) => {
    if (!onDelete) return;
    startTransition(async () => {
      const result = await onDelete(id);
      if (result.success) {
        toast.success("Deleted successfully.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete.");
      }
    });
  };

  const handleBulkDelete = () => {
    if (!onBulkDelete) return;
    startTransition(async () => {
      const result = await onBulkDelete(selected);
      if (result.success) {
        toast.success(`Deleted ${selected.length} item(s).`);
        setSelected([]);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete.");
      }
    });
  };

  const buildPageHref = (p: number) => {
    if (!basePagePath) return "";
    const params = new URLSearchParams();
    if (searchDefaultValue) params.set("q", searchDefaultValue);
    params.set("page", String(p));
    return `${basePagePath}?${params.toString()}`;
  };

  const hasActions = rows.some((r) => r.editHref) || onDelete;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchAction ? (
          <form action={searchAction} className="flex-1 max-w-sm">
            <Input name="q" defaultValue={searchDefaultValue} placeholder={searchPlaceholder} />
          </form>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {selected.length > 0 && onBulkDelete ? (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isPending}>
              <Trash2 className="size-4" /> Delete ({selected.length})
            </Button>
          ) : null}
          {newHref ? (
            <Button size="sm" render={<Link href={newHref} />}>
              <Plus className="size-4" /> New
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              {onBulkDelete ? (
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </TableHead>
              ) : null}
              {columns.map((col) => (
                <TableHead key={col.header} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {hasActions ? <TableHead className="w-24 text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-muted-foreground py-10 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {onBulkDelete ? (
                    <TableCell>
                      <Checkbox checked={selected.includes(row.id)} onCheckedChange={() => toggleOne(row.id)} />
                    </TableCell>
                  ) : null}
                  {columns.map((col) => (
                    <TableCell key={col.header} className={col.className}>
                      {row[col.accessor]}
                    </TableCell>
                  ))}
                  {hasActions ? (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.editHref ? (
                          <Button variant="ghost" size="icon-sm" render={<Link href={row.editHref} />}>
                            <Pencil className="size-3.5" />
                          </Button>
                        ) : null}
                        {onDelete ? (
                          <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
                              <Trash2 className="size-3.5" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(row.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : null}
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {page && totalPages && basePagePath ? (
        <PagePagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
      ) : null}
    </div>
  );
}
