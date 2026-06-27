import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ArticleCard, type ArticleCardData } from "@/components/blog/article-card";

export function FeaturedArticles({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;
  const [first, ...rest] = articles;

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Latest Writing" title="Featured Articles" description="Reporting, essays, and analysis." />
          <Button variant="outline" render={<Link href="/blog" />}>
            All Articles <ArrowRight className="size-4" />
          </Button>
        </div>

        <RevealGroup className="mt-12 grid gap-8 lg:grid-cols-2">
          <RevealItem>
            <ArticleCard article={first} featured />
          </RevealItem>
          <div className="grid gap-8 sm:grid-cols-2">
            {rest.slice(0, 4).map((article) => (
              <RevealItem key={article.slug}>
                <ArticleCard article={article} />
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
