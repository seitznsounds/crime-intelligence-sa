import PageShell from "@/components/layout/PageShell";
import { StatsSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { Award } from "lucide-react";

export default function StatsLoading() {
  return (
    <PageShell
      title="Performance Leaderboard"
      subtitle="Comparative station audit across all 1,154 SAPS stations nationwide."
      badge="Comparative Station Audit"
      badgeColor="blue"
      icon={<Award className="w-6 h-6 text-accent-blue" />}
      actions={
        <div className="flex gap-3">
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-16 w-32" />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
            <div className="p-6 border-b border-border-glass flex justify-between items-center">
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-card p-8 border-border-glass bg-bg-glass space-y-6">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
