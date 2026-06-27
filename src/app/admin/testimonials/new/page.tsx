import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export const metadata: Metadata = { title: "Add Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Add Testimonial</h1>
        <p className="text-muted-foreground text-sm">Add a new testimonial.</p>
      </div>
      <TestimonialForm />
    </div>
  );
}
