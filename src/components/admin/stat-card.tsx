import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
          <p className="font-display mt-1 text-2xl">{value}</p>
        </div>
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
          <Icon className="text-primary size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
