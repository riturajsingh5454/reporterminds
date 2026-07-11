import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function BlogLoading() {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-20 w-full max-w-2xl" />
        </div>

        {/* Filters Skeleton */}
        <div className="mt-10 flex gap-4 border-b border-border/40 pb-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
