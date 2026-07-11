import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function AboutLoading() {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-64" />
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-[90%]" />
              <Skeleton className="h-6 w-[95%]" />
              <Skeleton className="h-6 w-[85%]" />
              <Skeleton className="h-6 w-[92%]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-[88%]" />
              <Skeleton className="h-6 w-[94%]" />
              <Skeleton className="h-6 w-[90%]" />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-[350px] space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
