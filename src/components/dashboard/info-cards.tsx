import { Users, TrendingUp, BookOpen, Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  value: string;
  change: string;
  icon: "users" | "trending" | "book" | "activity";
}

const iconMap = {
  users: Users,
  trending: TrendingUp,
  book: BookOpen,
  activity: Activity,
};

export function InfoCard({ title, value, change, icon }: InfoCardProps) {
  const Icon = iconMap[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
