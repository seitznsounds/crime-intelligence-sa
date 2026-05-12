"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  UserX, 
  ShieldAlert, 
  History, 
  Search, 
  Activity, 
  ChevronRight, 
  Skull, 
  Scale, 
  RefreshCw,
  Info,
  Fingerprint
} from "lucide-react";
import { getTrcVolumes, triggerVolumeBackfill } from "./actions";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton, VolumeSkeleton } from "@/components/ui/Skeleton";
import { IntelligenceNull } from "@/components/ui/StatusStates";

export default function AccountabilityPage() {
  const [selectedPerp, setSelectedPerp] = useState<any>(null);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [perpetrators, setPerpetrators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchData();

    if (supabase) {
      // Subscribe to realtime updates for volumes
      const channel = supabase
        .channel('trc_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trc_volumes' }, () => {
          fetchVolumes();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchVolumes(), fetchPerpetrators()]);
    setLoading(false);
  };

  const fetchVolumes = async () => {
    try {
      const data = await getTrcVolumes();
      setVolumes(data);
    } catch (err) {
      console.error("Error fetching volumes:", err);
    }
  };

  const fetchPerpetrators = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("humanity_crimes_perpetrators")
      .select("*")
      .order("risk_rank", { ascending: false });
    
    if (data) setPerpetrators(data);
  };

  const handleTriggerBackfill = async () => {
    setIsBackfilling(true);
    try {
      // Find the first QUEUED volume and trigger it
      const nextVolume = volumes.find(v => v.status === 'QUEUED');
      if (nextVolume) {
        const result = await triggerVolumeBackfill(nextVolume.volume_number);
        if (result && !result.success) {
          alert(`Backfill Error: ${result.error}`);
        }
      } else {
        alert("All volumes are currently indexing or indexed.");
      }
    } catch (error: any) {
      console.error("Backfill trigger failed:", error);
      alert("Failed to trigger backfill. Check console for details.");
    } finally {
      setIsBackfilling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INDEXED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'INDEXING': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'CRAWLED': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'QUEUED': return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
      case 'alive_unpunished': return 'text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5';
      case 'alive_punished': return 'text-accent-blue border-accent-blue/20 bg-accent-blue/5';
      case 'deceased_unpunished': return 'text-white/40 border-white/10 bg-white/5';
      case 'deceased_punished': return 'text-emerald-400/60 border-emerald-500/10 bg-emerald-500/5';
      default: return 'text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CRAWLED': return 'PENDING ANALYSIS';
      default: return status.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <PageShell
      title="Accountability Board"
      subtitle="Tracking unpunished perpetrators of crimes against humanity. TRC Volume 7 narratives cross-referenced with modern criminal databases."
      badge="Crimes Against Humanity Sector"
      badgeColor="crimson"
      icon={<UserX className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "History & Justice", href: "/accountability" }, { label: "Accountability Board", href: "/accountability" }]}
      actions={
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Apify RAG Excavation</p>
            <p className="text-[12px] font-mono font-bold text-accent-blue flex items-center gap-2"><Activity className="w-3 h-3" /> ACTIVE_QUERY: "TRC_RECORDS_1996"</p>
          </div>
          <button onClick={handleTriggerBackfill} disabled={isBackfilling} className="px-5 py-2.5 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-bg-glass-heavy transition-all flex items-center gap-3 text-foreground disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${isBackfilling ? 'animate-spin' : ''}`} /> Trigger Backfill
          </button>
        </div>
      }
    >

        {/* Tactical HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Unpunished Assets", value: "242", icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" /> },
            { label: "Pending Backfills", value: "1,204", icon: <RefreshCw className="w-4 h-4 text-accent-blue" /> },
            { label: "Deceased / Unresolved", value: "84", icon: <Skull className="w-4 h-4 text-muted-foreground/40" /> },
            { label: "Justice Index", value: "12.8%", icon: <Scale className="w-4 h-4 text-accent-gold" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Perpetrator Dossiers */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
              <History className="w-4 h-4 text-accent-crimson" /> Historical Injustice Records
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <DossierSkeleton key={i} />)
              ) : perpetrators.length === 0 ? (
                <div className="md:col-span-2">
                  <IntelligenceNull />
                </div>
              ) : (
                perpetrators.map((perp, i) => (
                  <motion.div 
                    key={perp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedPerp(perp)}
                    className={`glass-card p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-bright cursor-pointer transition-all relative overflow-hidden group ${selectedPerp?.id === perp.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
                  >
                    <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-bold tracking-widest border-l border-b rounded-bl-xl ${getStatusColor(perp.status)}`}>
                      {getStatusLabel(perp.status)}
                    </div>

                    <h4 className="text-2xl font-bold tracking-tighter uppercase mb-1 text-foreground">{perp.full_name}</h4>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">{perp.role_in_regime}</p>
                    
                    <div className="space-y-4 mb-8">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Documented Crimes</p>
                      <div className="flex flex-wrap gap-2">
                        {(perp.crimes_documented || []).map((crime: string, ci: number) => (
                          <span key={ci} className="px-2 py-0.5 bg-bg-glass border border-border-glass rounded text-[8px] font-mono text-muted-foreground">
                            {crime}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Dossier_Link_{perp.id}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Deep History Backfill Monitor */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-border-glass bg-bg-glass backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                <RefreshCw className={`w-4 h-4 ${isBackfilling ? 'animate-spin' : ''}`} /> TRC_REPORT_VAULT
              </h3>
              <div className="space-y-6">
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => <VolumeSkeleton key={i} />)
                ) : (
                  volumes.map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-foreground/80 uppercase">Vol {item.volume_number}: {item.title}</span>
                        <span className={`tracking-widest ${item.status === 'INDEXED' ? 'text-accent-blue' : item.status === 'INDEXING' ? 'text-accent-gold animate-pulse' : 'text-muted-foreground'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="h-1 bg-bg-glass-heavy rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${item.status === 'INDEXED' ? 'bg-accent-blue shadow-glow-blue' : item.status === 'INDEXING' ? 'bg-accent-gold shadow-glow-gold' : 'bg-muted-foreground/10'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 2 }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card p-8 border-border-glass bg-bg-glass">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                <RefreshCw className={`w-4 h-4 ${isBackfilling ? 'animate-spin' : ''}`} /> Backfill Monitor
              </h3>
              <div className="space-y-6">
                {[
                  { query: "Native Land Act 1913", status: "PROCESSING", progress: 62 },
                  { query: "Sharpville Massacre", status: "COMPLETED", progress: 100 },
                  { query: "State Security Council", status: "QUEUED", progress: 0 }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-foreground/80 uppercase">{item.query}</span>
                      <span className={`tracking-widest ${item.status === 'COMPLETED' ? 'text-accent-blue' : 'text-accent-gold'}`}>{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-bg-glass-heavy rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.status === 'COMPLETED' ? 'bg-accent-blue shadow-glow-blue' : 'bg-accent-gold shadow-glow-gold'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="glass-card p-8 border-accent-crimson/20 bg-accent-crimson/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-4 h-4 text-accent-crimson" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-crimson">Accountability Mandate</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light italic mb-0">
                "To forgive without accountability is to legitimize the crime. Our objective is to ensure that those who perpetrated crimes against humanity are never erased from the collective memory of justice."
              </p>
            </div>
          </div>
        </div>

        {/* Administrative Transparency & Reporting Gaps */}
        <div className="mt-24 mb-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-[1px] bg-accent-crimson/30"></div>
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-crimson">Administrative Transparency Audit (2018/19)</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reporting Gap Card: Home Robbery */}
            <div className="glass-card p-8 border-accent-crimson/30 bg-accent-crimson/[0.02] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Skull className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-xl bg-accent-crimson/10 border border-accent-crimson/20">
                  <ShieldAlert className="w-5 h-5 text-accent-crimson" />
                </div>
                <span className="px-2 py-1 bg-accent-crimson text-white text-[8px] font-bold tracking-widest rounded uppercase">Systemic Collapse</span>
              </div>
              <h4 className="text-xl font-bold tracking-tighter uppercase mb-2">Home Robbery Erasure</h4>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">SAPS Recording Failure Trend</p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">2015/16 Recording Rate</span>
                    <span className="text-sm font-bold text-foreground/80">66.0%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-blue/40 w-[66%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[8px] font-bold text-accent-crimson uppercase">2018/19 Recording Rate</span>
                    <span className="text-sm font-bold text-accent-crimson">20.3%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-crimson w-[20%]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-accent-crimson uppercase tracking-[0.2em]">60% Reporting Collapse</span>
                <p className="text-[8px] text-muted-foreground leading-tight">Administrative erasure of home robberies has increased by 3x since 2015.</p>
              </div>
            </div>

            {/* Reporting Gap Card: Housebreaking */}
            <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                  <Activity className="w-5 h-5 text-accent-blue" />
                </div>
                <span className="px-2 py-1 bg-accent-blue text-white text-[8px] font-bold tracking-widest rounded uppercase">Systemic Delay</span>
              </div>
              <h4 className="text-xl font-bold tracking-tighter uppercase mb-2">Housebreaking Gap</h4>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">Administrative Discrepancy</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">StatsSA (Reported)</span>
                  <span className="text-lg font-bold">467,599</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-blue w-full"></div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">SAPS (Recorded)</span>
                  <span className="text-lg font-bold text-accent-blue">220,865</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-blue/40 w-[47%]"></div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em]">2.1x Reporting Void</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
            </div>

            {/* Audit Summary Card */}
            <div className="glass-card p-10 border-border-glass bg-bg-glass-heavy flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Audit Conclusion</h4>
                <p className="text-sm text-foreground/80 leading-relaxed font-light italic mb-8">
                  "Official SAPS statistics represent roughly one-third of actual criminal activity. The 80% recording failure for home robberies suggests a targeted administrative erasure at the station level."
                </p>
              </div>
              <a 
                href="/intelligence/audit-reports/gpsjs-2019" 
                className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold hover:text-white transition-colors group"
              >
                Read Full Science Audit <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        {/* CLEAR-AA M&E Framework Audit */}
        <div className="mt-24 mb-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-[1px] bg-accent-gold/30"></div>
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold">NACS M&E Framework Audit — CLEAR-AA 2024</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { label: "Case Finalization", target: "75%", current: "52%", status: "STALLED", icon: <Scale className="w-5 h-5 text-accent-gold" /> },
              { label: "Consequence Mgmt (90d)", target: "80%", current: "34%", status: "CRITICAL", icon: <ShieldAlert className="w-5 h-5 text-accent-crimson" /> },
              { label: "Lifestyle Audits", target: "100%", current: "12%", status: "FAILURE", icon: <Fingerprint className="w-5 h-5 text-accent-blue" /> }
            ].map((metric, i) => (
              <div key={i} className="glass-card p-8 border-border-glass bg-bg-glass">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    {metric.icon}
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-bold tracking-widest rounded uppercase ${metric.status === 'FAILURE' || metric.status === 'CRITICAL' ? 'bg-accent-crimson/20 text-accent-crimson' : 'bg-accent-gold/20 text-accent-gold'}`}>
                    {metric.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold tracking-tighter uppercase mb-1">{metric.label}</h4>
                <div className="flex items-end justify-between mb-4">
                  <span className="text-3xl font-bold text-foreground">{metric.current}</span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Target: {metric.target}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${metric.status === 'FAILURE' || metric.status === 'CRITICAL' ? 'bg-accent-crimson' : 'bg-accent-gold'}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: metric.current }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 glass-card border-accent-blue/20 bg-accent-blue/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-4 h-4 text-accent-blue" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">GNU Strategic Context</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              "The transition to a Government of National Unity (GNU) presents a unique platform to institutionalize these M&E indicators into the Medium-Term Development Plan (MTDP). However, fragmented political will remains a primary risk factor for the 2030 targets." — <span className="text-white font-bold">CLEAR-AA Landscape Analysis (2024)</span>
            </p>
          </div>
        </div>
        <AnimatePresence>
          {selectedPerp && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedPerp(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-2xl border-border-glass bg-background p-12 relative shadow-glow-crimson"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedPerp(null)}
                  className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Close Dossier [ESC]
                </button>

                <div className="space-y-10">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 border rounded mb-4 ${getStatusColor(selectedPerp.status)}`}>
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase">{getStatusLabel(selectedPerp.status)}</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none text-foreground">{selectedPerp.full_name}</h2>
                    <p className="text-lg font-mono text-muted-foreground uppercase tracking-widest">{selectedPerp.role_in_regime}</p>
                  </div>

                  <div className="p-8 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                      <History className="w-4 h-4" /> Operational History
                    </p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light italic">
                      "{selectedPerp.historical_context}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Documented Violations</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(selectedPerp.crimes_documented || []).map((crime: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-bg-glass border border-border-glass rounded-xl">
                          <ShieldAlert className="w-4 h-4 text-accent-crimson" />
                          <span className="text-[10px] font-mono text-foreground/80 uppercase">{crime}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-5 bg-accent-crimson text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-glow">
                    Generate ICC Evidence Package
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </PageShell>
  );
}
