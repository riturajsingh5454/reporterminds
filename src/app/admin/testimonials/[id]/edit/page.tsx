import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Testimonial</h1>
        <p className="text-muted-foreground text-sm">{testimonial.authorName}</p>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
