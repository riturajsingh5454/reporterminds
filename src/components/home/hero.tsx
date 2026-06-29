"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = ["Journalist", "Author", "Professor", "Mentor", "Climate Communicator"];

export function Hero({ tagline, heroMedia }: { tagline?: string | null; heroMedia?: string | null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2400);
    return () => clearInterval(interval);
  }, []);

  const mediaUrl =
    heroMedia ||
    "https://reportersmind.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-17-at-16.24.28-scaled.jpeg";

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />
        <div className="bg-primary/10 absolute -top-32 -right-32 size-[36rem] rounded-full blur-3xl" />
        <div className="bg-accent/40 absolute bottom-0 left-1/4 size-[28rem] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary mb-6 block text-xs font-semibold tracking-[0.25em] uppercase"
            >
              ReportersMind
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
            >
              Stories that
              <br />
              outlast the deadline.
            </motion.h1>

            <div className="mt-6 h-10 overflow-hidden text-xl text-muted-foreground sm:text-2xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[index]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="block font-medium text-foreground"
                >
                  {roles[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
            >
              {tagline ??
                "Three decades chronicling the stories that shape our world — from newsroom desks to lecture halls, in print and on screen."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button size="lg" render={<Link href="/archive" />}>
                Explore the Archive
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/about" />}>
                Read the Story
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
          >
            <div className="from-primary/30 via-accent/30 absolute inset-0 rounded-[2rem] bg-gradient-to-br to-transparent blur-2xl" />
            <div className="glass relative h-full w-full overflow-hidden rounded-[2rem] border">
              <img
                src={mediaUrl}
                alt="ReportersMind Hero"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="text-muted-foreground size-5" />
      </motion.div>
    </section>
  );
}
