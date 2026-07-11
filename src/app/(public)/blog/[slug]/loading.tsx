import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function BlogPostLoading() {
  return (
    <article className="py-20">
      <Container className="max-w-3xl">
        {/* Article Header Skeleton */}
        <div className="space-y-6 mb-12 text-center">
          <Skeleton className="h-6 w-24 mx-auto rounded-full" />
          <Skeleton className="h-12 w-full mx-auto max-w-2xl" />
          <Skeleton className="h-12 w-3/4 mx-auto max-w-xl" />
          <div className="flex justify-center items-center gap-4 mt-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Featured Image Skeleton */}
        <Skeleton className="h-[400px] w-full rounded-xl mb-12" />

        {/* Content Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[95%]" />
          <Skeleton className="h-6 w-[90%]" />
          <div className="py-4" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[92%]" />
          <Skeleton className="h-6 w-[88%]" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[94%]" />
        </div>
      </Container>
    </article>
  );
}
