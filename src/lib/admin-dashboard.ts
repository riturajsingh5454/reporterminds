import { prisma } from "@/lib/prisma";

function dayKey(d: Date) {
  return d.toISOString().slice(5, 10); // MM-DD
}

export async function getDashboardData() {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

  const [
    articlesCount,
    booksCount,
    videosCount,
    archiveCount,
    galleryCount,
    subscribersCount,
    newContactsCount,
    pageViews,
    newsletterSubs,
    recentContacts,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.book.count({ where: { status: "PUBLISHED" } }),
    prisma.video.count(),
    prisma.archive.count(),
    prisma.gallery.count(),
    prisma.newsletter.count({ where: { status: "SUBSCRIBED" } }),
    prisma.contactRequest.count({ where: { status: "NEW" } }),
    prisma.pageView.findMany({ where: { createdAt: { gte: fourteenDaysAgo } }, select: { createdAt: true } }),
    prisma.newsletter.findMany({ where: { subscribedAt: { gte: eightWeeksAgo } }, select: { subscribedAt: true } }),
    prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  // Visitors by day, last 14 days
  const visitorsMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    visitorsMap.set(dayKey(d), 0);
  }
  for (const pv of pageViews) {
    const key = dayKey(pv.createdAt);
    if (visitorsMap.has(key)) visitorsMap.set(key, (visitorsMap.get(key) ?? 0) + 1);
  }
  const visitorsByDay = Array.from(visitorsMap.entries()).map(([date, visitors]) => ({ date, visitors }));

  // Subscriber growth, cumulative by week, last 8 weeks
  const weekBuckets: { weekStart: Date; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    weekBuckets.push({ weekStart: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000), count: 0 });
  }
  for (const sub of newsletterSubs) {
    for (let i = weekBuckets.length - 1; i >= 0; i--) {
      if (sub.subscribedAt >= weekBuckets[i].weekStart) {
        weekBuckets[i].count += 1;
        break;
      }
    }
  }
  let cumulative = 0;
  const subscriberGrowth = weekBuckets.map((bucket, idx) => {
    cumulative += bucket.count;
    return { week: `W${idx + 1}`, subscribers: cumulative };
  });

  const contentByModule = [
    { module: "Books", count: booksCount },
    { module: "Articles", count: articlesCount },
    { module: "Archive", count: archiveCount },
    { module: "Videos", count: videosCount },
    { module: "Gallery", count: galleryCount },
  ];

  return {
    stats: {
      totalVisitors: pageViews.length,
      articlesCount,
      booksCount,
      videosCount,
      subscribersCount,
      newContactsCount,
    },
    visitorsByDay,
    subscriberGrowth,
    contentByModule,
    recentContacts,
  };
}
