import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 대시보드 KPI 카드: 지표 + 증감 뱃지. Card primitive를 조합한 L2 패턴.
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: { value: string; trend: "up" | "down" };
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {change ? (
          <Badge
            variant={change.trend === "up" ? "default" : "destructive"}
            className={cn(change.trend === "up" && "bg-emerald-600/90")}
          >
            {change.trend === "up" ? "+" : "-"}
            {change.value}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
