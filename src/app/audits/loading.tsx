import PageShell from "@/components/layout/PageShell";
import { AuditSkeleton } from "@/components/ui/Skeleton";
import { Building2 } from "lucide-react";

export default function Loading() {
  return (
    <PageShell
      title="Institutional Audits"
      subtitle="Loading forensic accountability hearings from TRC Volume 4..."
      badge="TRC Phase 5: Institutional Audit Sector"
      badgeColor="crimson"
      icon={<Building2 className="w-6 h-6 text-accent-crimson" />}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass space-y-4">
            <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-5">
          {[...Array(3)].map((_, i) => (
            <AuditSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass space-y-6">
            <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
