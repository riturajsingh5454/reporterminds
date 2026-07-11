import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function HomeLoading() {
  return (
    <div className="space-y-24 py-10">
      {/* Hero Skeleton */}
      <Container>
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6 w-full">
            <Skeleton className="h-16 w-3/4 max-w-lg" />
            <Skeleton className="h-6 w-full max-w-md" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <Skeleton className="h-[400px] w-full max-w-sm rounded-xl" />
          </div>
        </div>
      </Container>

      {/* Stats Skeleton */}
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton className="h-12 w-20 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </Container>

      {/* Featured Sections Skeleton */}
      <Container>
        <div className="space-y-12">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
