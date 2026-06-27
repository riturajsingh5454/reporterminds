import { prisma, safeQuery } from "@/lib/prisma";
import type { ArchiveSection } from "@prisma/client";

const PAGE_SIZE = 12;

export async function getArchiveList(
  section: ArchiveSection,
  filters: { page?: string; category?: string; year?: string; q?: string },
) {
  const page = Math.max(1, Number(filters.page) || 1);

  const where = {
    section,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.year ? { year: Number(filters.year) } : {}),
    ...(filters.q ? { title: { contains: filters.q, mode: "insensitive" as const } } : {}),
  };

  const [items, total, categories, years] = await Promise.all([
    safeQuery(
      () =>
        prisma.archive.findMany({
          where,
          include: { category: true },
          orderBy: { year: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
      [],
    ),
    safeQuery(() => prisma.archive.count({ where }), 0),
    safeQuery(
      () => prisma.archiveCategory.findMany({ where: { section }, orderBy: { name: "asc" } }),
      [],
    ),
    safeQuery(
      () =>
        prisma.archive.findMany({
          where: { section },
          select: { year: true },
          distinct: ["year"],
          orderBy: { year: "desc" },
        }),
      [],
    ),
  ]);

  return {
    items,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    categories,
    years: years.map((y) => y.year),
  };
}
