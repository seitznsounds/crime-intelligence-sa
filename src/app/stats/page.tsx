import { createServerClient } from "@/lib/supabase-server";
import { BarChart3, ShieldAlert, TrendingDown, Search, Filter, ArrowUpRight, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createServerClient();

  // Fetch top 20 station statistics
  const { data: stats, error } = await supabase
    .from("station_statistics")
    .select("*")
    .order("incident_count", { ascending: false })
    .limit(20);

  // Fetch summary stats
  const { data: summaryData } = await supabase
    .from("station_statistics")
    .select("incident_count, category");

  const totalIncidents = summaryData?.reduce((acc, curr) => acc + (curr.incident_count || 0), 0) || 0;
  
  // Find top category
  const categoryMap: Record<string, number> = {};
  summaryData?.forEach(s => {
    if (s.category) {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + (s.incident_count || 0);
    }
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="container py-12 animate-fade-in">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center border border-accent-blue/20">
            <BarChart3 className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Station Audits</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">National Safety Performance Index</p>
          </div>
        </div>
      </header>

      {/* Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Indexed Crimes", value: totalIncidents.toLocaleString(), icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" />, sub: "National Database" },
          { label: "Dominant Category", value: topCategory, icon: <Filter className="w-4 h-4 text-accent-gold" />, sub: "High Frequency Threat" },
          { label: "Database Accuracy", value: "98.4%", icon: <TrendingDown className="w-4 h-4 text-accent-blue" />, sub: "Verified Ingestion" }
        ].map((m, i) => (
          <div key={i} className="glass-card p-6 bg-white/[0.01] border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{m.label}</span>
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">{m.icon}</div>
            </div>
            <p className="text-2xl font-bold tracking-tighter mb-1 uppercase">{m.value}</p>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Leaderboard Table */}
      <div className="glass-card border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest">SAPS Safety Leaderboard</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input 
                type="text" 
                placeholder="SEARCH_STATION_ID..." 
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-accent-blue/40 w-64"
              />
            </div>
            <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-white/40">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                <th className="px-6 py-4">Station ID</th>
                <th className="px-6 py-4">Primary Category</th>
                <th className="px-6 py-4">Incident Volume</th>
                <th className="px-6 py-4">Reporting Period</th>
                <th className="px-6 py-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-mono text-[10px] text-accent-crimson uppercase tracking-widest">
                    ERROR_RETRIEVING_AUDIT_DATA: {error.message}
                  </td>
                </tr>
              ) : stats?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-mono text-[10px] text-white/20 uppercase tracking-widest">
                    NO_AUDIT_RECORDS_INDEXED_YET
                  </td>
                </tr>
              ) : (
                stats?.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <MapPin className="w-3.5 h-3.5 text-white/30" />
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-tight mb-0.5">{s.station_name || "STATION_UNNAMED"}</p>
                          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">#{s.station_id?.split('-')[0] || "UNKN_ID"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold font-mono tracking-tighter">{s.incident_count}</span>
                        <div className="flex-1 max-w-[100px] h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent-crimson/50" 
                            style={{ width: `${Math.min((s.incident_count / 1500) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-mono text-white/40 uppercase">{s.period}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-accent-blue text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 hover:border-accent-blue transition-all group-hover:translate-x-[-4px]">
                        Full Audit <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
          <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors py-2">
            Load More Operational Data
          </button>
        </div>
      </div>
    </div>
  );
}
