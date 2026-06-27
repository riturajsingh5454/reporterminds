"use client";

import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  subscribers: { label: "Subscribers", color: "var(--chart-2)" },
};

export function SubscriberGrowthChart({ data }: { data: { week: string; subscribers: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subscriber Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="subscribers" type="monotone" stroke="var(--color-subscribers)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
