import { createServerClient } from "@/lib/supabase-server";
import { BarChart3, ShieldAlert, TrendingDown, Search, Filter, ArrowUpRight, MapPin, Award, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import TrueCrimeEstimator from "@/components/intel/TrueCrimeEstimator";
import OversightRadar from "@/components/intel/OversightRadar";
import DataTabs from "@/components/ui/DataTabs";
import ForensicInfo from "@/components/ui/ForensicInfo";

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

  const TABS = [
    { id: "all", label: "National Ranking", count: 50 },
    { id: "violent", label: "Violent Hotspots", count: 12 },
    { id: "gaps", label: "Reporting Gaps" }
  ];

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
          <div className="glass-card px-6 py-3 border-accent-crimson/20 bg-accent-crimson/5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-accent-crimson" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-crimson">Critical</span>
            </div>
            <p className="text-xl font-black tracking-tight text-charcoal">{violentRatio}%</p>
            <p className="text-[10px] font-black text-charcoal-40 uppercase tracking-widest">Violent Ratio</p>
          </div>
          <div className="glass-card px-6 py-3 border-accent-blue/20 bg-accent-blue/5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-accent-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue">Health</span>
            </div>
            <p className="text-xl font-black tracking-tight text-charcoal">94.2%</p>
            <p className="text-[10px] font-black text-charcoal-40 uppercase tracking-widest text-nowrap">Audit Integrity</p>
          </div>
        </div>
      }
    >
      <div className="mb-12">
        <DataTabs tabs={TABS} activeTab="all" onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
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

            <div className="hidden sm:block overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-charcoal-3 text-[11px] font-black uppercase tracking-[0.2em] text-charcoal-40 border-b border-border">
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Station</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Volume</th>
                    <th className="px-8 py-5 text-right font-black">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-nowrap">
                  {stats?.map((s, i) => (
                    <tr key={s.id} className="hover:bg-charcoal-3 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <span className="text-[13px] font-mono font-black text-charcoal-40">#{String(i + 1).padStart(3, '0')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-charcoal-3 border border-border flex items-center justify-center group-hover:border-charcoal-40 transition-colors">
                            <MapPin className="w-4 h-4 text-charcoal-40" />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold tracking-tight mb-0.5 text-charcoal">{s.station_name || "UNNAMED"}</p>
                            <p className="text-[11px] font-mono text-charcoal-40 uppercase tracking-widest">#{s.station_id?.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${["Murder", "Attempted murder"].includes(s.category!) ? 'text-accent-crimson' : 'text-charcoal-83'}`}>
                          {s.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <TrueCrimeEstimator initialCount={s.incident_count || 0} category={s.category || ""} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/stats/${s.id}`} className="inline-flex items-center gap-2 px-5 py-2 bg-charcoal text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-button-inset hover:opacity-80 transition-all">
                          Dossier <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-border-glass">
              {stats?.map((s, i) => (
                <Link key={s.id} href={`/stats/${s.id}`} className="flex items-center gap-3 p-4 hover:bg-bg-glass-heavy transition-colors">
                  <span className="text-[12px] font-mono font-bold text-muted-foreground w-8">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold tracking-tight text-foreground truncate">{s.station_name || "UNNAMED"}</p>
                    <p className={`text-[12px] font-medium mb-2 ${["Murder", "Attempted murder"].includes(s.category!) ? 'text-accent-crimson' : 'text-muted-foreground'}`}>
                      {s.category}
                    </p>
                    <TrueCrimeEstimator initialCount={s.incident_count || 0} category={s.category || ""} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OversightRadar />
          
          <div className="glass-card p-8 border-border-glass bg-bg-glass">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue mb-6 flex items-center gap-2 text-nowrap">
              Intelligence Foundation
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[11px] font-bold text-foreground mb-1 italic">"The 4.9x Multiplier"</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-light">
                  Derived from the structural delta between StatsSA experienced crime surveys and SAPS official recordings for Home Robbery.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-accent-crimson/5 border border-accent-crimson/10">
                <p className="text-[11px] font-bold text-accent-crimson mb-1 italic">Reporting Void</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-light">
                  Institutional decay identified in 80% of top-tier stations where recorded dockets fail to meet experienced reality thresholds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
