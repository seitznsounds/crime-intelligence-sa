import { createServerClient } from "@/lib/supabase-server";
import { Award, AlertTriangle, ShieldCheck, ArrowUpRight, Globe, Building2 } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";
import OversightRadar from "@/components/intel/OversightRadar";
import { getOversightMetrics } from "@/components/intel/actions";
import { MobileExpandableChart } from "@/components/ui/MobileExpandableChart";
import StatsClient from "./StatsClient";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createServerClient();
  const oversightMetrics = await getOversightMetrics();

  // Fetch top 50 station statistics
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
      title="Police Station Rankings"
      subtitle="Compare crime statistics across all 1,154 police stations in South Africa."
      badge="Crime Statistics"
      badgeColor="blue"
      icon={<Award className="w-6 h-6 text-accent-blue" />}
      guidance="This page ranks every police station in South Africa by the number of reported crimes. You can see which stations have the most crime, compare violent crime ratios, and explore how official statistics may undercount real crime levels."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Data", href: "/stats" },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <StatsClient stats={stats || []} />
        </div>

        <div className="space-y-6">
          <MobileExpandableChart 
            title="Oversight Radar" 
            description="Intelligence Metrics and Reporting Quality across critical stations."
          >
            <OversightRadar initialMetrics={oversightMetrics} />
          </MobileExpandableChart>
          
          <div className="glass-card p-8 border-border-glass bg-bg-glass">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue mb-6 flex items-center gap-2 text-nowrap">
              Key Findings
            </h3>
            <div className="space-y-4">
              <Link href="/stats/void" className="block group">
                <div className="p-5 rounded-xl bg-accent-crimson/5 border border-accent-crimson/20 hover:border-accent-crimson/50 hover:bg-accent-crimson/10 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[12px] font-black text-accent-crimson uppercase tracking-widest italic flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" /> The Hidden Crime Gap
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-accent-crimson group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-light mb-3">
                    Research shows nearly 5× more home robberies happen than police officially record.
                  </p>
                  <span className="inline-block px-3 py-1 bg-background text-[9px] font-bold uppercase tracking-widest text-foreground rounded-full border border-border">
                    Explore the Gap
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <WhatNext suggestions={[
        { title: "Crime Map", description: "See crime density across South Africa on an interactive map.", href: "/map", icon: "Globe" },
        { title: "Government Audits", description: "Review audits of police and government departments.", href: "/audits", icon: "Building2" },
      ]} />
    </PageShell>
  );
}
