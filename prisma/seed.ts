import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Site settings (singleton) ---
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "ReportersMind",
        tagline: "Journalist. Author. Professor. Climate Communicator.",
        socialLinks: {
          twitter: "https://twitter.com/reportersmind",
          linkedin: "https://linkedin.com/in/reportersmind",
          youtube: "https://youtube.com/@reportersmind",
          instagram: "https://instagram.com/reportersmind",
        },
        contactEmail: "contact@reportersmind.com",
        yearsExperience: 25,
        studentsMentored: 1200,
        youtubeChannelId: "",
      },
    });
  }

  // --- Admin user ---
  const passwordHash = await bcrypt.hash("ChangeMe!123", 10);
  await prisma.user.upsert({
    where: { email: "admin@reportersmind.com" },
    update: { passwordHash, isActive: true },   // always reset password on re-seed
    create: {
      name: "Admin",
      email: "admin@reportersmind.com",
      passwordHash,
      role: "SUPER_ADMIN",
      bio: "Founder, journalist, author, and educator.",
    },
  });

  // --- Timeline events ---
  const timelineData = [
    { year: 1998, title: "Joined Press Trust of India", description: "Began career as a correspondent covering national affairs.", category: "CAREER" as const, order: 1 },
    { year: 2004, title: "Lead Environment Correspondent", description: "Took charge of climate and environment reporting desk.", category: "CAREER" as const, order: 2 },
    { year: 2009, title: "First Book Published", description: "Released debut non-fiction work on climate journalism.", category: "MEDIA" as const, order: 3 },
    { year: 2013, title: "Visiting Professor", description: "Began teaching journalism and media ethics at a leading university.", category: "ACADEMIC" as const, order: 4 },
    { year: 2018, title: "National Journalism Award", description: "Recognized for outstanding contribution to science journalism.", category: "AWARD" as const, order: 5 },
    { year: 2022, title: "YouTube Educational Channel Launch", description: "Launched a channel mentoring the next generation of journalists.", category: "MEDIA" as const, order: 6 },
  ];
  for (const t of timelineData) {
    const existing = await prisma.timelineEvent.findFirst({ where: { year: t.year, title: t.title } });
    if (!existing) await prisma.timelineEvent.create({ data: t });
  }

  // --- Achievements ---
  const achievementsData = [
    { title: "National Journalism Excellence Award", year: 2018, category: "AWARD" as const, issuer: "Press Council" },
    { title: "Best Science Reporting", year: 2015, category: "AWARD" as const, issuer: "Science Writers Guild" },
    { title: "1000+ Students Mentored", year: 2023, category: "MILESTONE" as const, issuer: null },
    { title: "Lifetime Contribution to Climate Journalism", year: 2021, category: "RECOGNITION" as const, issuer: "Climate Media Forum" },
  ];
  for (const a of achievementsData) {
    const existing = await prisma.achievement.findFirst({ where: { title: a.title } });
    if (!existing) await prisma.achievement.create({ data: a });
  }

  // --- Article categories + tags ---
  const articleCategoryNames = ["Politics", "Environment", "Climate", "Health", "Science", "Education", "Society"];
  const articleCategories = [];
  for (const name of articleCategoryNames) {
    const slug = name.toLowerCase();
    const cat = await prisma.articleCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `${name} coverage and analysis.` },
    });
    articleCategories.push(cat);
  }

  const tagNames = ["Climate Change", "Policy", "Investigative", "Opinion", "Interview", "Sustainability"];
  const tags = [];
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
    tags.push(tag);
  }

  // --- Articles (blog) ---
  const articleSeeds = [
    {
      slug: "the-future-of-climate-journalism",
      title: "The Future of Climate Journalism",
      excerpt: "How newsrooms are adapting to cover the defining story of our era.",
      category: articleCategories[2],
      isFeatured: true,
    },
    {
      slug: "why-science-literacy-matters-in-the-newsroom",
      title: "Why Science Literacy Matters in the Newsroom",
      excerpt: "A look at the gap between scientific research and public reporting.",
      category: articleCategories[4],
      isFeatured: true,
    },
    {
      slug: "education-policy-after-the-pandemic",
      title: "Education Policy After the Pandemic",
      excerpt: "Examining structural shifts in education systems post-2020.",
      category: articleCategories[5],
      isFeatured: false,
    },
    {
      slug: "covering-public-health-with-integrity",
      title: "Covering Public Health with Integrity",
      excerpt: "Lessons from two decades of health reporting.",
      category: articleCategories[3],
      isFeatured: false,
    },
  ];
  for (const a of articleSeeds) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        contentHtml: `<p>${a.excerpt}</p><p>This is placeholder long-form content for "${a.title}", editable from the admin panel.</p>`,
        coverImage: "/placeholder/article-cover.jpg",
        categoryId: a.category.id,
        tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }] },
        status: "PUBLISHED",
        publishedAt: new Date(),
        isFeatured: a.isFeatured,
        readTimeMins: 6,
      },
    });
  }

  // --- Archive categories + items ---
  const archiveCategorySeeds = [
    { name: "Politics", slug: "politics", section: "JOURNALISM" as const },
    { name: "Environment", slug: "environment", section: "JOURNALISM" as const },
    { name: "Health", slug: "health", section: "JOURNALISM" as const },
    { name: "PTI Articles", slug: "pti-articles", section: "LEGACY_PRINT" as const },
    { name: "Newspaper Reports", slug: "newspaper-reports", section: "LEGACY_PRINT" as const },
    { name: "Science Spectrum", slug: "science-spectrum", section: "LEGACY_PRINT" as const },
    { name: "Editorials", slug: "editorials", section: "LEGACY_PRINT" as const },
  ];
  const archiveCategories: Record<string, { id: string; section: "JOURNALISM" | "LEGACY_PRINT" }> = {};
  for (const c of archiveCategorySeeds) {
    const cat = await prisma.archiveCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
    archiveCategories[c.slug] = cat;
  }

  const archiveSeeds = [
    { slug: "1999-national-budget-report", title: "National Budget Report, 1999", year: 1999, categorySlug: "pti-articles", publication: "Press Trust of India" },
    { slug: "2003-monsoon-failure-analysis", title: "Monsoon Failure: An Analysis", year: 2003, categorySlug: "newspaper-reports", publication: "The National Herald" },
    { slug: "2010-genome-mapping-feature", title: "Genome Mapping Comes of Age", year: 2010, categorySlug: "science-spectrum", publication: "Science Spectrum" },
    { slug: "2015-editorial-on-press-freedom", title: "On Press Freedom", year: 2015, categorySlug: "editorials", publication: "The National Herald" },
    { slug: "2020-climate-policy-deep-dive", title: "Climate Policy: A Deep Dive", year: 2020, categorySlug: "environment", publication: "ReportersMind" },
  ];
  for (const a of archiveSeeds) {
    const cat = archiveCategories[a.categorySlug];
    await prisma.archive.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        content: `Placeholder digitized clipping content for "${a.title}".`,
        year: a.year,
        categoryId: cat.id,
        publication: a.publication,
        section: cat.section,
        attachments: [{ url: "/placeholder/clipping.pdf", type: "pdf", label: "Original clipping" }],
        tags: ["archive", "legacy"],
        isFeatured: false,
      },
    });
  }

  // --- Books ---
  const bookSeeds = [
    { slug: "the-climate-beat", title: "The Climate Beat", description: "A frontline account of reporting on the climate crisis.", publishedYear: 2009, isFeatured: true },
    { slug: "ink-and-deadline", title: "Ink and Deadline", description: "Memoirs from three decades in the newsroom.", publishedYear: 2016, isFeatured: true },
    { slug: "teaching-truth", title: "Teaching Truth", description: "A guide to journalism ethics for the next generation.", publishedYear: 2021, isFeatured: false },
  ];
  for (const b of bookSeeds) {
    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        title: b.title,
        description: b.description,
        coverImage: "/placeholder/book-cover.jpg",
        galleryImages: ["/placeholder/book-cover.jpg"],
        publishedYear: b.publishedYear,
        publisher: "Independent Press",
        language: "English",
        pages: 280,
        price: 19.99,
        purchaseLinks: { amazon: "https://amazon.com", flipkart: "https://flipkart.com" },
        isFeatured: b.isFeatured,
        status: "PUBLISHED",
      },
    });
    const existingReview = await prisma.bookReview.findFirst({ where: { bookId: book.id } });
    if (!existingReview) {
      await prisma.bookReview.create({
        data: {
          bookId: book.id,
          reviewerName: "Reader Review",
          rating: 5,
          content: `An essential read — "${b.title}" delivers sharp insight and compelling storytelling.`,
          source: "Goodreads",
        },
      });
    }
  }

  // --- Gallery categories + items ---
  const galleryCategorySeeds = ["Journalism", "Events", "Nature", "Travel", "Academic"];
  const galleryCategories = [];
  for (const name of galleryCategorySeeds) {
    const slug = name.toLowerCase();
    const cat = await prisma.galleryCategory.upsert({ where: { slug }, update: {}, create: { name, slug } });
    galleryCategories.push(cat);
  }
  for (let i = 0; i < galleryCategories.length; i++) {
    const cat = galleryCategories[i];
    const count = await prisma.gallery.count({ where: { categoryId: cat.id } });
    if (count === 0) {
      await prisma.gallery.createMany({
        data: Array.from({ length: 4 }).map((_, idx) => ({
          imageUrl: `/placeholder/gallery-${i + 1}-${idx + 1}.jpg`,
          caption: `${cat.name} moment ${idx + 1}`,
          categoryId: cat.id,
          width: 800,
          height: idx % 2 === 0 ? 1000 : 600,
          order: idx,
        })),
      });
    }
  }

  // --- Testimonials ---
  const testimonialSeeds = [
    { authorName: "Aisha Khan", role: "Former Student", category: "STUDENT" as const, content: "The mentorship I received shaped my entire career in journalism.", type: "TEXT" as const },
    { authorName: "Rahul Mehta", role: "News Editor", company: "Daily Express", category: "PROFESSIONAL" as const, content: "One of the most rigorous and ethical journalists I've worked alongside.", type: "TEXT" as const },
    { authorName: "Priya Nair", role: "Graduate Student", category: "STUDENT" as const, content: "Inspiring lectures that connect theory with real newsroom practice.", type: "VIDEO" as const, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];
  for (const t of testimonialSeeds) {
    const existing = await prisma.testimonial.findFirst({ where: { authorName: t.authorName } });
    if (!existing) await prisma.testimonial.create({ data: { ...t, isFeatured: true } });
  }

  // --- Playlists + videos ---
  const playlist = await prisma.playlist.upsert({
    where: { youtubePlaylistId: "PLplaceholder001" },
    update: {},
    create: {
      youtubePlaylistId: "PLplaceholder001",
      title: "Journalism Masterclass",
      description: "A series on the craft of modern journalism.",
      thumbnail: "/placeholder/playlist-cover.jpg",
    },
  });
  const videoSeeds = [
    { youtubeId: "a-NLDHyg0Ew", title: "How to Build a News Story From Scratch" },
    { youtubeId: "s6sP0UJJHgs", title: "Interviewing Techniques That Work" },
    { youtubeId: "dQw4w9WgXcQ", title: "Climate Reporting in the Field" },
  ];
  for (const v of videoSeeds) {
    await prisma.video.upsert({
      where: { youtubeId: v.youtubeId },
      update: {},
      create: {
        youtubeId: v.youtubeId,
        title: v.title,
        description: `Placeholder description for "${v.title}".`,
        thumbnail: `https://i.ytimg.com/vi/${v.youtubeId.replace(/[^a-zA-Z0-9_-]/g, "")}/hqdefault.jpg`,
        publishedAt: new Date(),
        durationSec: 600,
        viewCount: 1200,
        playlistId: playlist.id,
        isFeatured: true,
      },
    });
  }

  // --- SEO settings ---
  await prisma.sEOSettings.upsert({
    where: { path: "/" },
    update: {},
    create: {
      path: "/",
      title: "ReportersMind — Journalist, Author, Professor",
      description: "The official platform of a veteran journalist, author, and educator.",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
