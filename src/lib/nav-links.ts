export const primaryNavLinks = [
  { href: "/about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/blog", label: "Writing" },
  { href: "/archive", label: "Archive" },
  { href: "/youtube", label: "YouTube Hub" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const footerLinkGroups = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/books", label: "Books" },
      { href: "/blog", label: "Writing" },
      { href: "/gallery", label: "Photo Gallery" },
    ],
  },
  {
    title: "Archive",
    links: [
      { href: "/archive", label: "Journalism Archive" },
      { href: "/legacy-in-print", label: "Legacy in Print" },
      { href: "/youtube", label: "YouTube Hub" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  // {
  //   title: "Connect",
  //   links: [
  //     { href: "/contact", label: "Contact" },
  //     { href: "/contact?type=speaking", label: "Speaking Invitation" },
  //     { href: "/contact?type=media", label: "Media Inquiry" },
  //     { href: "/login", label: "Admin Login" },
  //   ],
  // },
] as const;
