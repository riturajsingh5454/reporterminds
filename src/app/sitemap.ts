import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, books, archives, articleCategories, galleryCategories] = await Promise.all([
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.book.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.archive.findMany({ select: { slug: true, updatedAt: true, category: { select: { slug: true } } } }),
    prisma.articleCategory.findMany({ select: { slug: true } }),
    prisma.galleryCategory.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/books",
    "/blog",
    "/archive",
    "/legacy-in-print",
    "/youtube",
    "/gallery",
    "/testimonials",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${SITE_URL}/books/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const archiveRoutes: MetadataRoute.Sitemap = archives.map((a) => ({
    url: `${SITE_URL}/archive/${a.category.slug}/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = [
    ...articleCategories.map((c) => ({ url: `${SITE_URL}/blog/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...galleryCategories.map((c) => ({ url: `${SITE_URL}/gallery?category=${c.slug}`, changeFrequency: "monthly" as const, priority: 0.3 })),
  ];

  return [...staticRoutes, ...articleRoutes, ...bookRoutes, ...archiveRoutes, ...categoryRoutes];
}
