import type { Metadata } from "next";
import { Users, Newspaper, BookOpen, Video, Mail, Inbox } from "lucide-react";
import { getDashboardData } from "@/lib/admin-dashboard";
import { getSession } from "@/lib/auth/session";
import { StatCard } from "@/components/admin/stat-card";
import { VisitorsChart } from "@/components/admin/charts/visitors-chart";
import { SubscriberGrowthChart } from "@/components/admin/charts/subscriber-growth-chart";
import { ContentGrowthChart } from "@/components/admin/charts/content-growth-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  const { stats, visitorsByDay, subscriberGrowth, contentByModule, recentContacts } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">An overview of ReportersMind&apos;s content and engagement.</p>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-3 xl:grid-cols-6" : "lg:grid-cols-3"}`}>
        {isSuperAdmin && <StatCard label="Visitors (14d)" value={stats.totalVisitors} icon={Users} />}
        <StatCard label="Articles" value={stats.articlesCount} icon={Newspaper} />
        <StatCard label="Books" value={stats.booksCount} icon={BookOpen} />
        <StatCard label="Videos" value={stats.videosCount} icon={Video} />
        {isSuperAdmin && <StatCard label="Subscribers" value={stats.subscribersCount} icon={Mail} />}
        {isSuperAdmin && <StatCard label="New Inquiries" value={stats.newContactsCount} icon={Inbox} />}
      </div>

      <div className={isSuperAdmin ? "grid gap-4 lg:grid-cols-3" : "grid gap-4 lg:grid-cols-1"}>
        {isSuperAdmin && <VisitorsChart data={visitorsByDay} />}
        {isSuperAdmin && <SubscriberGrowthChart data={subscriberGrowth} />}
        <ContentGrowthChart data={contentByModule} />
      </div>

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Contact Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentContacts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No contact requests yet.</p>
            ) : (
              recentContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{c.type.replace("_", " ")}</Badge>
                    <Badge variant={c.status === "NEW" ? "default" : "secondary"}>{c.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
