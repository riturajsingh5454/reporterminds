import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { TestimonialCard, type TestimonialCardData } from "@/components/testimonials/testimonial-card";

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialCardData[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Voices"
          title="What People Say"
          description="From newsrooms to classrooms — words from colleagues and students."
          align="center"
        />

        <Carousel className="mx-auto mt-12 max-w-5xl" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {testimonials.map((t, idx) => (
              <CarouselItem key={`${t.authorName}-${idx}`} className="sm:basis-1/2 lg:basis-1/3">
                <TestimonialCard testimonial={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </section>
  );
}
