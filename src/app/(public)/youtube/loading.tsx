import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function YoutubeLoading() {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-16 w-full" />
        </div>

        {/* Featured Video Skeleton */}
        <div className="mt-12 mb-16">
          <Skeleton className="aspect-video w-full max-w-4xl rounded-xl mx-auto" />
          <div className="max-w-4xl mx-auto mt-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Video Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
              </div>
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
