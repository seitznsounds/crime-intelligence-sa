"use client";

import { useState } from "react";
import { 
  BarChart3, 
  MapPin, 
  ArrowUpRight 
} from "lucide-react";
import DataTabs from "@/components/ui/DataTabs";
import { ResponsiveDataGrid } from "@/components/ui/ResponsiveDataGrid";
import TrueCrimeEstimator from "@/components/intel/TrueCrimeEstimator";
import ForensicInfo from "@/components/ui/ForensicInfo";
import { Search, Filter } from "lucide-react";

export default function StatsClient({ stats }: { stats: any[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const TABS = [
    { id: "all", label: "National Ranking", count: stats.length },
    { id: "violent", label: "Violent Hotspots", count: stats.filter(s => ["Murder", "Attempted murder"].includes(s.category || "")).length },
    { id: "gaps", label: "Reporting Gaps" }
  ];

  const filteredStats = activeTab === "all" 
    ? stats 
    : activeTab === "violent" 
    ? stats.filter(s => ["Murder", "Attempted murder", "Common robbery", "Robbery with aggravating circumstances"].includes(s.category || ""))
    : stats; // For "gaps", we might want different logic but keep as is for now

  return (
    <>
      <div className="mb-12">
        <DataTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="glass-card border-border overflow-hidden bg-background">
        <div className="p-6 sm:p-8 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background">
          <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-charcoal-40 flex items-center gap-3">
            National Performance Ranking
            <ForensicInfo 
              title="Station Ranking" 
              content="Ranked by total incident volume." 
              source="SAPS Annual Stats 2025"
            />
          </h3>
          <div className="flex gap-3">
            <button className="p-2.5 bg-charcoal-3 rounded-full border border-border text-charcoal-40 hover:text-charcoal hover:border-charcoal-40 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40" />
              <input type="text" placeholder="Search station..." className="bg-charcoal-3 border border-border rounded-full pl-11 pr-6 py-2.5 text-[13px] font-medium tracking-wide focus:outline-none focus:border-charcoal-40 w-48 sm:w-64 text-charcoal" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <ResponsiveDataGrid 
            data={filteredStats || []}
            keyExtractor={(s) => s.id}
            rowHref={(s) => `/stats/${s.id}`}
            columns={[
              {
                header: "Rank",
                accessorKey: "rank",
                mobilePriority: "hidden",
                cell: (s: any) => {
                  const idx = stats?.findIndex(item => item.id === s.id) ?? 0;
                  return <span className="text-[13px] font-mono font-black text-charcoal-40">#{String(idx + 1).padStart(3, '0')}</span>;
                }
              },
              {
                header: "Station",
                accessorKey: "station_name",
                mobilePriority: "primary",
                cell: (s: any) => (
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex w-10 h-10 rounded-xl bg-charcoal-3 border border-border items-center justify-center group-hover:border-charcoal-40 transition-colors">
                      <MapPin className="w-4 h-4 text-charcoal-40" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold tracking-tight mb-0.5 text-foreground">{s.station_name || "UNNAMED"}</p>
                      <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">#{s.station_id?.split('-')[0]}</p>
                    </div>
                  </div>
                )
              },
              {
                header: "Category",
                accessorKey: "category",
                mobilePriority: "secondary",
                cell: (s: any) => (
                  <span className={`text-[11px] font-black uppercase tracking-widest ${["Murder", "Attempted murder"].includes(s.category!) ? 'text-accent-crimson' : 'text-muted-foreground'}`}>
                    {s.category}
                  </span>
                )
              },
              {
                header: "Volume",
                accessorKey: "volume",
                mobilePriority: "secondary",
                cell: (s: any) => <TrueCrimeEstimator initialCount={s.incident_count || 0} category={s.category || ""} />
              },
              {
                header: "Audit",
                accessorKey: "audit",
                mobilePriority: "hidden",
                className: "text-right",
                cell: (s: any) => (
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-charcoal text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-button-inset transition-all relative z-20">
                    Dossier <ArrowUpRight className="w-3 h-3" />
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </>
  );
}
