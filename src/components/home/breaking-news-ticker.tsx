import Link from "next/link";
import { prisma, safeQuery } from "@/lib/prisma";

type TickerItem = { id: string; kind: "Blog" | "Book" | "Archive"; title: string; href: string; date: Date };

const PER_SOURCE = 5;
const MAX_ITEMS = 14;
// Seconds of scrolling per headline, so long lists don't fly past.
const SECONDS_PER_ITEM = 7;

async function getTickerItems(): Promise<TickerItem[]> {
  const [articles, books, archives] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: PER_SOURCE,
          select: { id: true, slug: true, title: true, publishedAt: true, createdAt: true },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.book.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: PER_SOURCE,
          select: { id: true, slug: true, title: true, createdAt: true },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.archive.findMany({
          orderBy: { createdAt: "desc" },
          take: PER_SOURCE,
          select: { id: true, slug: true, title: true, createdAt: true, category: { select: { slug: true } } },
        }),
      [],
    ),
  ]);

  const items: TickerItem[] = [
    ...articles.map((a) => ({
      id: `article-${a.id}`,
      kind: "Blog" as const,
      title: a.title,
      href: `/blog/${a.slug}`,
      date: a.publishedAt ?? a.createdAt,
    })),
    ...books.map((b) => ({
      id: `book-${b.id}`,
      kind: "Book" as const,
      title: b.title,
      href: `/books/${b.slug}`,
      date: b.createdAt,
    })),
    ...archives.map((a) => ({
      id: `archive-${a.id}`,
      kind: "Archive" as const,
      title: a.title,
      href: `/archive/${a.category.slug}/${a.slug}`,
      date: a.createdAt,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, MAX_ITEMS);
}

function TickerGroup({ items, hidden }: { items: TickerItem[]; hidden?: boolean }) {
  return (
    <ul className="ticker-group flex min-w-full shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.id} className="flex shrink-0 items-center">
          <Link
            href={item.href}
            tabIndex={hidden ? -1 : undefined}
            className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-white/90 transition-colors hover:text-white"
          >
            <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
              {item.kind}
            </span>
            <span className="font-medium whitespace-nowrap">{item.title}</span>
          </Link>
          <span className="text-red-500" aria-hidden>
            ◆
          </span>
        </li>
      ))}
    </ul>
  );
}

/** "Breaking news" strip shown under the header: newest blogs, books and archive items scrolling in a marquee. */
export async function BreakingNewsTicker() {
  const items = await getTickerItems();
  if (items.length === 0) return null;

  const duration = Math.max(30, items.length * SECONDS_PER_ITEM);

  return (
    <section aria-label="Latest updates" className="border-y border-white/10 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="relative z-10 flex shrink-0 items-stretch" aria-hidden>
          <span className="ticker-badge-left flex items-center bg-gradient-to-r from-neutral-950 via-neutral-500 to-neutral-200 py-2 pr-7 pl-4 text-xs font-extrabold tracking-wide text-neutral-950 uppercase sm:text-sm">
            Important
          </span>
          <span className="ticker-badge-right -ml-3 flex items-center bg-red-600 py-2 pr-5 pl-6 font-display text-base font-black tracking-wide text-white uppercase italic sm:text-xl">
            News
          </span>
        </div>

        <div className="ticker relative min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max" style={{ ["--ticker-duration" as string]: `${duration}s` }}>
            <TickerGroup items={items} />
            <TickerGroup items={items} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
