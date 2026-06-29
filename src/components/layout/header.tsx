"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { primaryNavLinks } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "glass border-b" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://reportersmind.com/wp-content/uploads/2022/12/cropped-cropped-Reporters-mind-favicon.jpg"
            alt="ReportersMind Logo"
            className="size-16 rounded object-cover"
          />
          <span className="font-display text-lg tracking-tight">ReportersMind</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {primaryNavLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button render={<Link href="/contact" />} className="hidden lg:inline-flex">
            Get in Touch
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">ReportersMind</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {primaryNavLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/contact"
                      className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    />
                  }
                >
                  Contact
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
