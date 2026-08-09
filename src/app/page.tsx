"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { useActivityHeatmap } from "@/features/dashboard/hooks/use-activity-heatmap";
import { BarChart } from "@/features/dashboard/components/bar-chart";
import { ContributionHeatmap } from "@/features/dashboard/components/contribution-heatmap";
import { loadSampleData } from "@/lib/sample-data";
import { CheckCircle2, Flame, Timer, Code2, Sparkles, type LucideIcon } from "lucide-react";

function relativeTime(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-lg font-semibold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const {
    isLoading,
    doneCount,
    focusMinutesToday,
    streak,
    snippetCount,
    weekSeries,
    recentActivity,
    refresh,
  } = useDashboardData();
  const { days: heatmapDays, isLoading: heatmapLoading } = useActivityHeatmap();

  if (isLoading || heatmapLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="font-heading text-lg font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Tasks Completed" value={doneCount} />
        <StatCard icon={Timer} label="Focus Today" value={`${focusMinutesToday}m`} />
        <StatCard icon={Flame} label="Day Streak" value={streak} />
        <StatCard icon={Code2} label="Snippets Saved" value={snippetCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity — Last 16 Weeks</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionHeatmap days={heatmapDays} />
          <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-muted" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/25" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/50" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/75" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Focus Time — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={weekSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <p className="text-sm text-muted-foreground">Nothing yet — go build something.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await loadSampleData();
                    await refresh();
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Load Sample Data
                </Button>
              </div>
            ) : (
              recentActivity.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {relativeTime(item.timestamp)}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}