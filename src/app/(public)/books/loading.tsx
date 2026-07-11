import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function BooksLoading() {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-4 text-center max-w-2xl mx-auto mb-16">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="space-y-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-12 items-center">
              {/* Cover Skeleton */}
              <div className="w-full md:w-[300px] shrink-0">
                <Skeleton className="aspect-[2/3] w-full rounded-xl shadow-lg" />
              </div>

              {/* Details Skeleton */}
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-10 w-32 rounded-md" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
