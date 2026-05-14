import PageShell from "@/components/layout/PageShell";
import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <PageShell
      title="AI Corruption Forecasting"
      subtitle="Initialising link analysis engine and processing entity weights..."
      badge="Predictive Analysis Sector"
      badgeColor="gold"
      icon={<Brain className="w-6 h-6 text-accent-gold" />}
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
            <div key={i} className="glass-card p-8 border-border-glass bg-bg-glass space-y-6">
                <div className="flex justify-between">
                    <div className="h-8 w-1/3 bg-white/5 rounded animate-pulse" />
                    <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
