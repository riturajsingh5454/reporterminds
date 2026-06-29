"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { adminNavGroups } from "@/lib/admin-nav";

interface AdminSidebarProps {
  userRole?: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredNavGroups = userRole === "SUPER_ADMIN"
    ? adminNavGroups
    : adminNavGroups.filter((group) => group.title === "Overview" || group.title === "Content");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5">
          <img
            src="https://reportersmind.com/wp-content/uploads/2022/12/cropped-cropped-Reporters-mind-favicon.jpg"
            alt="ReportersMind Logo"
            className="size-5 rounded object-cover shrink-0"
          />
          <span className="font-display truncate text-base">ReportersMind</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton render={<Link href={item.href} />} isActive={active} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
