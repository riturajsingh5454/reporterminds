"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
};

export function VisitorsChart({ data }: { data: { date: string; visitors: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Visitors (Last 14 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="visitors"
              type="monotone"
              fill="var(--color-visitors)"
              fillOpacity={0.2}
              stroke="var(--color-visitors)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
