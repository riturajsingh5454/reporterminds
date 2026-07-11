import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function GalleryLoading() {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-20 w-full max-w-2xl" />
        </div>

        {/* Category Pills */}
        <div className="mt-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        {/* Masonry/Grid Skeleton */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              className={`w-full rounded-xl ${
                i % 3 === 0 ? "h-80" : i % 2 === 0 ? "h-64" : "h-96"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
