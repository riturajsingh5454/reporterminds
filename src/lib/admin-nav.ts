import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Archive,
  Video,
  MessageSquareQuote,
  Image as ImageIcon,
  FolderTree,
  Tag,
  Inbox,
  Mail,
  Users,
  Search,
  Settings,
} from "lucide-react";

export const adminNavGroups = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/books", label: "Books", icon: BookOpen },
      { href: "/admin/articles", label: "Articles", icon: Newspaper },
      { href: "/admin/archive", label: "Archive", icon: Archive },
      { href: "/admin/videos", label: "Videos", icon: Video },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    title: "Taxonomy",
    items: [
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/tags", label: "Tags", icon: Tag },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: "/admin/contacts", label: "Contact Requests", icon: Inbox },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/seo", label: "SEO", icon: Search },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;
