import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar userName={session.name} userEmail={session.email} />
        <main className="flex-1 space-y-6 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
