"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  History, 
  Map as MapIcon, 
  ShieldAlert, 
  Scale, 
  Activity, 
  ChevronRight, 
  MapPin, 
  Users, 
  Zap,
  ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RestitutionPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchZones = async () => {
      const { data, error } = await supabase
        .from("land_restitution_cases")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setZones(data);
      setLoading(false);
    };

    fetchZones();
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-crimson/30 transition-colors duration-300">
      {/* Background Cinematic Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent-crimson-opacity),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-crimson/10 rounded-2xl flex items-center justify-center border border-accent-crimson/20 shadow-glow-crimson">
              <History className="w-6 h-6 text-accent-crimson" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Land Restitution Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase text-foreground">Reclaim the Land</h1>
            </div>
          </div>
        </header>

        {/* Tactical HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Stolen Hectares", value: "1.2M", icon: <MapIcon className="w-4 h-4 text-accent-crimson" /> },
            { label: "Displaced Families", value: "3.5M+", icon: <Users className="w-4 h-4 text-accent-crimson" /> },
            { label: "Unresolved Cases", value: "8,204", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
            { label: "Restoration Rate", value: "12.4%", icon: <Activity className="w-4 h-4 text-accent-blue" /> }
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
          {/* Historical Map Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card h-[600px] border-border-glass bg-bg-glass-heavy relative overflow-hidden group">
              {/* Simplified SA Map with Red Zones */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 1000 1000" className="w-[80%] h-[80%] opacity-20 grayscale">
                   <path d="M200,750 L150,850 L250,950 L550,900 L850,550 L800,250 L650,150 L350,150 L200,450 Z" fill="currentColor" className="text-foreground/10" stroke="currentColor" strokeWidth="2" />
                </svg>
                
                {/* Highlighted Stolen Zones */}
                {zones.map((zone, idx) => (
                  <motion.circle 
                    key={zone.id}
                    cx={idx === 0 ? "180" : idx === 1 ? "620" : "780"} 
                    cy={idx === 0 ? "780" : idx === 1 ? "320" : "480"} 
                    r={idx === 0 ? "40" : idx === 1 ? "30" : "35"} 
                    className="fill-accent-crimson/20 stroke-accent-crimson animate-pulse cursor-pointer" 
                    onClick={() => setSelectedZone(zone)} 
                  />
                ))}
              </div>

              <div className="absolute bottom-8 left-8 p-6 glass-card bg-background/60 border-border-glass backdrop-blur-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-crimson mb-2 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> High-Density Displacement Zone
                </h4>
                <p className="text-[9px] font-mono text-muted-foreground uppercase">Sector: DISTRICT_SIX // STATUS: UNRESTORED</p>
              </div>

              <div className="absolute top-8 right-8 space-y-3">
                <button className="flex items-center gap-3 px-4 py-2 bg-bg-glass border border-border-glass rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-bg-glass-bright transition-all backdrop-blur-md text-foreground">
                  <MapPin className="w-3.5 h-3.5" /> Historical Layer
                </button>
                <button className="flex items-center gap-3 px-4 py-2 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-accent-crimson transition-all backdrop-blur-md">
                  <Scale className="w-3.5 h-3.5" /> Restitution Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stolen Land Dossiers */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-accent-crimson" /> Injustice Dossiers
            </h3>
            
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              {zones.map((zone, i) => (
                <motion.div 
                  key={zone.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedZone(zone)}
                  className={`glass-card p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-bright cursor-pointer transition-all ${selectedZone?.id === zone.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">ID: {zone.id.slice(0, 8)}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${zone.reclamation_status === 'unresolved' ? 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'}`}>
                      {zone.reclamation_status?.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold tracking-tighter uppercase mb-2 text-foreground">{zone.title}</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-mono uppercase">{zone.location_name}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-light mb-6 line-clamp-2">
                    {zone.description}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{(zone.metadata?.families || 0).toLocaleString()} Displaced</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Case Overlay */}
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/80 backdrop-blur-sm"
          >
            <div className="glass-card w-full max-w-4xl border-border-glass bg-background p-12 relative shadow-glow-crimson overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setSelectedZone(null)}
                className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Close Case [ESC]
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-4">
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Crimes Against Humanity // SEIZURE_REPORT</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-4 leading-none text-foreground">{selectedZone.title}</h2>
                    <p className="text-lg font-mono text-muted-foreground uppercase tracking-widest">{selectedZone.location_name}, South Africa</p>
                  </div>

                  <div className="p-8 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                      <History className="w-4 h-4" /> Historical Context
                    </p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light italic">
                      "{selectedZone.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 border-border-glass bg-bg-glass">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Seizure Date</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-foreground">{selectedZone.date_of_seizure}</p>
                    </div>
                    <div className="glass-card p-6 border-border-glass bg-bg-glass">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Displacement</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-accent-crimson">{(selectedZone.metadata?.families || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="aspect-square bg-bg-glass border border-border-glass rounded-3xl flex items-center justify-center group overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800" alt="Historical Displacement" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-accent-crimson/10 mix-blend-overlay" />
                    <div className="absolute bottom-8 left-8 right-8 glass-card p-4 bg-background/60 border-border-glass backdrop-blur-md">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">ARCHIVE_VISUAL_001: Historical Removal Site</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Restitution Status</h5>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-2 bg-bg-glass-heavy rounded-full overflow-hidden">
                          <motion.div className="h-full bg-accent-crimson" initial={{ width: 0 }} animate={{ width: "15%" }} />
                       </div>
                       <span className="text-xs font-mono font-bold text-accent-crimson">15% RESOLVED</span>
                    </div>
                    <button className="w-full mt-6 py-5 bg-bg-glass border border-border-glass text-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all group">
                      Sign Petition for Land Restoration <ArrowRight className="inline-flex w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
