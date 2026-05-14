import PageShell from "@/components/layout/PageShell";
import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <PageShell
      title="Zero-Knowledge Vault"
      subtitle="Initialising cryptographic protocols..."
      badge="Whistleblower Protection 2.0"
      badgeColor="blue"
      icon={<ShieldCheck className="w-6 h-6 text-accent-blue" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 border-border-glass bg-bg-glass space-y-8">
            <div className="h-6 w-1/3 bg-white/5 rounded animate-pulse" />
            <div className="flex justify-between gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-border-glass animate-pulse" />
                  <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-32 w-full bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
