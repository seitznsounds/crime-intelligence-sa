import PageShell from "@/components/layout/PageShell";
import { Map as MapIcon } from "lucide-react";

export default function Loading() {
  return (
    <PageShell
      title="Geospatial Intelligence"
      subtitle="Initialising satellite link and spatial data nodes..."
      badge="Geospatial Intelligence"
      badgeColor="crimson"
      icon={<MapIcon className="w-6 h-6 text-accent-crimson" />}
    >
      <div className="relative w-full h-[600px] sm:h-[800px] glass-card border-border-glass bg-bg-glass-heavy rounded-3xl overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-accent-crimson/20 border-t-accent-crimson animate-spin" />
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Spatial Hubs...</p>
        </div>
      </div>
    </PageShell>
  );
}
