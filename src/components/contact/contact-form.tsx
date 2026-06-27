"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { submitContactRequest } from "@/server/actions/contact";

const typeOptions = [
  { value: "GENERAL", label: "General" },
  { value: "MEETING", label: "Meeting" },
  { value: "SPEAKING", label: "Speaking" },
  { value: "MEDIA_INQUIRY", label: "Media Inquiry" },
];

const subjectPlaceholders: Record<string, string> = {
  GENERAL: "What's this about?",
  MEETING: "Proposed meeting topic",
  SPEAKING: "Event name & date",
  MEDIA_INQUIRY: "Publication / outlet",
};

export function ContactForm({ defaultType = "GENERAL" }: { defaultType?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState(defaultType);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="space-y-5"
      action={(formData) => {
        startTransition(async () => {
          const result = await submitContactRequest(formData);
          if (result.success) {
            toast.success("Message sent — we'll be in touch soon.");
            formRef.current?.reset();
            setType("GENERAL");
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      <input type="hidden" name="type" value={type} />

      <div>
        <Label className="mb-2 block">Inquiry Type</Label>
        <Tabs value={type} onValueChange={setType}>
          <TabsList className="w-full">
            {typeOptions.map((opt) => (
              <TabsTrigger key={opt.value} value={opt.value}>
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" placeholder={subjectPlaceholders[type]} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required minLength={10} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
