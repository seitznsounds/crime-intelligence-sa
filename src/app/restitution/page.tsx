"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { History, Map as MapIcon, ShieldAlert, Scale, Activity, ChevronRight, MapPin, Users, Zap, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton } from "@/components/ui/Skeleton";

export default function RestitutionPage() {
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    supabase.from("land_restitution_cases").select("*").order("created_at", { ascending: false }).then(({ data }: { data: any[] | null }) => { 
      if (data) setZones(data); 
      setLoading(false);
    });
  }, [supabase]);

  return (
    <PageShell
      title="Reclaim the Land"
      subtitle="Mapping historical land seizures and displacement. 1.2M hectares stolen, 3.5M+ families displaced — only 12.4% restored."
      badge="Land Restitution Sector"
      badgeColor="crimson"
      icon={<History className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "History & Justice", href: "/accountability" }, { label: "Land Restitution", href: "/restitution" }]}
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Stolen Hectares", value: "1.2M", icon: <MapIcon className="w-4 h-4 text-accent-crimson" /> },
          { label: "Displaced Families", value: "3.5M+", icon: <Users className="w-4 h-4 text-accent-crimson" /> },
          { label: "Unresolved Cases", value: "8,204", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
          { label: "Restoration Rate", value: "12.4%", icon: <Activity className="w-4 h-4 text-accent-blue" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3"><span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>{item.icon}</div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="glass-card h-[500px] sm:h-[600px] border-border-glass bg-bg-glass-heavy relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 1000 1000" className="w-[80%] h-[80%] opacity-20 grayscale">
                <path d="M200,750 L150,850 L250,950 L550,900 L850,550 L800,250 L650,150 L350,150 L200,450 Z" fill="currentColor" className="text-foreground/10" stroke="currentColor" strokeWidth="2" />
              </svg>
              {zones.map((zone, idx) => (
                <motion.div key={String(zone.id)} className="absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer" style={{ left: `${[18, 62, 78][idx % 3]}%`, top: `${[78, 32, 48][idx % 3]}%` }} onClick={() => setSelectedZone(zone)} whileHover={{ scale: 1.3 }}>
                  <div className="w-full h-full bg-accent-crimson/20 border-2 border-accent-crimson rounded-full animate-pulse" />
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-6 left-6 p-4 glass-card bg-background/60 border-border-glass backdrop-blur-xl">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-crimson mb-1 flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> High-Density Displacement Zone</h4>
              <p className="text-[11px] font-mono text-muted-foreground uppercase">Sector: DISTRICT_SIX // STATUS: UNRESTORED</p>
            </div>
            <div className="absolute top-6 right-6 space-y-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-bg-glass border border-border-glass rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-bg-glass-heavy transition-all text-foreground"><MapPin className="w-3.5 h-3.5" /> Historical Layer</button>
              <button className="flex items-center gap-2 px-3 py-2 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[11px] font-bold uppercase tracking-widest text-accent-crimson"><Scale className="w-3.5 h-3.5" /> Restitution Filter</button>
            </div>
          </div>
        </div>

        {/* Dossiers */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 flex items-center gap-3"><ShieldAlert className="w-4 h-4 text-accent-crimson" /> Injustice Dossiers</h3>
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <DossierSkeleton key={i} />)
            ) : zones.length === 0 ? (
              <div className="glass-card p-6 border-border-glass bg-bg-glass text-center">
                <p className="text-[13px] text-muted-foreground font-mono uppercase tracking-wider">No restitution cases found.</p>
              </div>
            ) : (
              zones.map((zone, i) => (
                <motion.div key={String(zone.id)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedZone(zone)}
                  className={`glass-card p-5 sm:p-6 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy cursor-pointer transition-all ${selectedZone?.id === zone.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase">ID: {String(zone.id).slice(0, 8)}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${zone.reclamation_status === 'unresolved' ? 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'}`}>{String(zone.reclamation_status ?? '').toUpperCase()}</span>
                  </div>
                  <h4 className="text-[15px] font-bold tracking-tighter uppercase mb-2 text-foreground">{String(zone.title ?? '')}</h4>
                  <div className="flex items-center gap-2 mb-3 text-muted-foreground"><MapPin className="w-3 h-3" /><span className="text-[12px] font-mono uppercase">{String(zone.location_name ?? '')}</span></div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-light mb-4 line-clamp-2">{String(zone.description ?? '')}</p>
                  <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{Number((zone.metadata as Record<string, number>)?.families ?? 0).toLocaleString()} Displaced</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Overlay */}
      {selectedZone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedZone(null)}>
          <div className="glass-card w-full max-w-3xl border-border-glass bg-background p-8 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedZone(null)} className="absolute top-6 right-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Close [ESC]</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-4"><span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent-crimson">SEIZURE_REPORT</span></div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase mb-3 text-foreground">{String(selectedZone.title ?? '')}</h2>
                  <p className="text-[13px] font-mono text-muted-foreground uppercase">{String(selectedZone.location_name ?? '')}, South Africa</p>
                </div>
                <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Historical Context</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic">"{String(selectedZone.description ?? '')}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 border-border-glass bg-bg-glass"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Seizure Date</p><p className="text-lg font-bold font-mono tracking-tighter text-foreground">{String(selectedZone.date_of_seizure ?? 'Unknown')}</p></div>
                  <div className="glass-card p-4 border-border-glass bg-bg-glass"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Displacement</p><p className="text-lg font-bold font-mono tracking-tighter text-accent-crimson">{Number((selectedZone.metadata as Record<string, number>)?.families ?? 0).toLocaleString()}</p></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-square bg-bg-glass border border-border-glass rounded-3xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800" alt="Historical Displacement" className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Restitution Status</h5>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-1 h-2 bg-bg-glass-heavy rounded-full overflow-hidden"><motion.div className="h-full bg-accent-crimson" initial={{ width: 0 }} animate={{ width: "15%" }} /></div>
                    <span className="text-[12px] font-mono font-bold text-accent-crimson">15% RESOLVED</span>
                  </div>
                  <button className="w-full py-4 bg-bg-glass border border-border-glass text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all group">Sign Petition for Land Restoration <ArrowRight className="inline-flex w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </PageShell>
  );
}
