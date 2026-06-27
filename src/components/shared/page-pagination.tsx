import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function PagePagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <Pagination className="mt-16">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={page > 1 ? buildHref(page - 1) : undefined} aria-disabled={page <= 1} />
        </PaginationItem>
        {pages.map((p, idx) => (
          <PaginationItem key={p}>
            {idx > 0 && pages[idx - 1] !== p - 1 ? <PaginationEllipsis /> : null}
            <PaginationLink href={buildHref(p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={page < totalPages ? buildHref(page + 1) : undefined} aria-disabled={page >= totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
