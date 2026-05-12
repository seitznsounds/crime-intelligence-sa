import { createServerClient } from "@/lib/supabase-server";
import { BarChart3, ShieldAlert, TrendingDown, Search, Filter, ArrowUpRight, MapPin, Award, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createServerClient();

  // Fetch top 50 station statistics with a focus on high-risk categories
  const { data: stats, error } = await supabase
    .from("station_statistics")
    .select("*")
    .order("incident_count", { ascending: false })
    .limit(50);

  // Summary Metrics
  const totalIncidents = stats?.reduce((acc, curr) => acc + (curr.incident_count || 0), 0) || 0;
  const highRiskIncidents = stats?.filter(s => ["Murder", "Attempted murder", "Common robbery", "Robbery with aggravating circumstances"].includes(s.category || "")).reduce((acc, curr) => acc + (curr.incident_count || 0), 0) || 0;
  const violentRatio = totalIncidents > 0 ? (highRiskIncidents / totalIncidents * 100).toFixed(1) : "0.0";

  return (
    <PageShell
      title="Performance Leaderboard"
      subtitle="Comparative station audit across all 1,154 SAPS stations nationwide."
      badge="Comparative Station Audit"
      badgeColor="blue"
      icon={<Award className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Data", href: "/stats" },
        { label: "Station Audits", href: "/stats" },
      ]}
      actions={
        <div className="flex gap-3 flex-wrap">
          <div className="glass-card px-5 py-3 border-accent-crimson/20 bg-accent-crimson/[0.02]">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-accent-crimson" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Critical</span>
            </div>
            <p className="text-lg font-bold tracking-tighter text-foreground">{violentRatio}%</p>
            <p className="text-[11px] font-mono text-muted-foreground uppercase">Violent Crime</p>
          </div>
          <div className="glass-card px-5 py-3 border-accent-blue/20 bg-accent-blue/[0.02]">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent-blue">Health</span>
            </div>
            <p className="text-lg font-bold tracking-tighter text-foreground">94.2%</p>
            <p className="text-[11px] font-mono text-muted-foreground uppercase">Audit Integrity</p>
          </div>
        </div>
      }
    >
      {/* Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Top Performers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card border-border-glass overflow-hidden bg-bg-glass">
            <div className="p-4 sm:p-6 border-b border-border-glass flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-bg-glass">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-muted-foreground">National Performance Ranking</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-bg-glass-heavy rounded-lg border border-border-glass text-muted-foreground hover:text-foreground transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                  <input type="text" placeholder="Search station..." className="bg-bg-glass-heavy border border-border-glass rounded-lg pl-9 pr-4 py-2 text-[12px] font-mono tracking-wide focus:outline-none w-40 sm:w-48 text-foreground transition-colors" />
                </div>
              </div>
            </div>

            {/* Mobile: Card view / Desktop: Table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-glass text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground border-b border-border-glass">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Station</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Volume</th>
                    <th className="px-6 py-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {stats?.map((s, i) => (
                    <tr key={s.id} className="hover:bg-bg-glass-heavy transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-mono font-bold text-muted-foreground">#{String(i + 1).padStart(3, '0')}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-bg-glass-heavy border border-border-glass flex items-center justify-center">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold tracking-tight mb-0.5 text-foreground">{s.station_name || "UNNAMED"}</p>
                            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide truncate max-w-[120px]">#{s.station_id?.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-[11px] font-bold uppercase tracking-wide ${["Murder", "Attempted murder"].includes(s.category!) ? 'text-accent-crimson' : 'text-muted-foreground'}`}>
                            {s.category}
                          </span>
                          <div className="w-24 h-1 bg-bg-glass-heavy rounded-full overflow-hidden">
                            <div className={`h-full ${["Murder", "Attempted murder"].includes(s.category!) ? 'bg-accent-crimson' : 'bg-accent-blue/40'}`} style={{ width: '65%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-bold font-mono tracking-tighter text-foreground">{s.incident_count}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/stats/${s.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-glass hover:bg-accent-blue text-[11px] font-bold uppercase tracking-wide rounded-lg border border-border-glass hover:border-accent-blue text-muted-foreground hover:text-white transition-all">
                          Dossier <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-border-glass">
              {stats?.map((s, i) => (
                <Link key={s.id} href={`/stats/${s.id}`} className="flex items-center gap-3 p-4 hover:bg-bg-glass-heavy transition-colors">
                  <span className="text-[12px] font-mono font-bold text-muted-foreground w-8">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold tracking-tight text-foreground truncate">{s.station_name || "UNNAMED"}</p>
                    <p className={`text-[12px] font-medium ${["Murder", "Attempted murder"].includes(s.category!) ? 'text-accent-crimson' : 'text-muted-foreground'}`}>
                      {s.category}
                    </p>
                  </div>
                  <span className="text-[14px] font-bold font-mono text-foreground">{s.incident_count}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Alerts */}
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" /> Sector Deterioration
            </h3>
            <div className="space-y-5">
              {[
                { name: "Hillbrow", change: "+12.4%", status: "CRITICAL" },
                { name: "Sunnyside", change: "+8.1%", status: "HIGH_RISK" },
                { name: "Mitchells Plain", change: "+5.9%", status: "ELEVATED" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-bold uppercase tracking-wide mb-0.5 text-foreground">{item.name}</p>
                    <p className="text-[12px] font-mono text-accent-crimson">{item.change} TREND</p>
                  </div>
                  <span className="px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[11px] font-bold tracking-wide rounded border border-accent-crimson/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border-glass hover:bg-bg-glass-heavy rounded-xl text-[12px] font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all">
              Full Trend Report
            </button>
          </div>

          <div className="glass-card p-6 sm:p-8 border-accent-blue/10 bg-accent-blue/[0.01]">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent-blue/40 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> High Integrity Zones
            </h3>
            <div className="space-y-5">
              {[
                { name: "Rosebank", index: "9.2/10", status: "STABLE" },
                { name: "Claremont", index: "8.9/10", status: "IMPROVING" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-bold uppercase tracking-wide mb-0.5 text-foreground">{item.name}</p>
                    <p className="text-[12px] font-mono text-accent-blue">SAFETY: {item.index}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue text-[11px] font-bold tracking-wide rounded border border-accent-blue/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
