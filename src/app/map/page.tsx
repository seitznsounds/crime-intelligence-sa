"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, ShieldAlert, Target, Activity, Map as MapIcon, ChevronRight, Zap } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const HOTSPOTS = [
  { id: 1, name: "Johannesburg Central", x: 620, y: 320, risk: 94, incidents: 12402 },
  { id: 2, name: "Cape Town Metro", x: 180, y: 780, risk: 88, incidents: 9541 },
  { id: 3, name: "Durban Port", x: 780, y: 480, risk: 91, incidents: 8203 },
  { id: 4, name: "Pretoria North", x: 630, y: 280, risk: 72, incidents: 5430 },
  { id: 5, name: "Port Elizabeth", x: 520, y: 820, risk: 65, incidents: 3102 },
];

interface Hotspot {
  id: number;
  name: string;
  x: number;
  y: number;
  risk: number;
  incidents: number;
}

export default function CrimeMapPage() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <PageShell
      title="Geospatial Intelligence"
      subtitle="Interactive 3D visualization of crime density across South Africa. Monitoring 324 active hotspots in real-time."
      badge="Geospatial Intelligence"
      badgeColor="crimson"
      icon={<MapIcon className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Data", href: "/stats" },
        { label: "Geospatial Map", href: "/map" },
      ]}
    >
      <div className="relative w-full h-[600px] sm:h-[800px] glass-card border-border-glass bg-bg-glass-heavy rounded-3xl overflow-hidden flex items-center justify-center p-4 sm:p-10">
        {/* Map Canvas */}
        <motion.div 
          className="relative w-full max-w-4xl aspect-[4/3]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-[0_0_50px_rgba(255,59,48,0.05)]">
            <motion.path 
              d="M200,750 L150,850 L250,950 L550,900 L850,550 L800,250 L650,150 L350,150 L200,450 Z" 
              fill="var(--bg-glass)"
              stroke="var(--border-glass-bright)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {HOTSPOTS.map((spot) => (
              <g key={spot.id}>
                <motion.circle 
                  cx={spot.x} cy={spot.y} r="60"
                  fill="url(#heatGradient)"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: spot.id * 0.5 }}
                />
                <defs>
                  <radialGradient id="heatGradient">
                    <stop offset="0%" stopColor="var(--accent-crimson)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--accent-crimson)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <motion.circle 
                  cx={spot.x} cy={spot.y} r="5" 
                  className="fill-accent-crimson cursor-pointer shadow-glow-crimson"
                  onClick={() => setSelectedHotspot(spot)}
                />
                <circle 
                  cx={spot.x} cy={spot.y} r="20" 
                  className="fill-transparent stroke-accent-crimson/10 stroke-1 cursor-pointer hover:stroke-accent-crimson/40 transition-all"
                  onClick={() => setSelectedHotspot(spot)}
                />
              </g>
            ))}
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            <button className="flex items-center gap-3 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all backdrop-blur-md">
              <Zap className="w-3.5 h-3.5" /> High Precision Mode
            </button>
            <button className="flex items-center gap-3 px-4 py-2 bg-accent-crimson/10 border border-accent-crimson/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-accent-crimson transition-all backdrop-blur-md">
              <Target className="w-3.5 h-3.5" /> Recalibrate Hotspots
            </button>
          </div>
        </motion.div>

        {/* HUD Overlay - Bottom Left */}
        <div className="absolute bottom-6 left-6 space-y-4 max-w-[280px] hidden md:block pointer-events-none">
          <div className="glass-card p-5 border-border-glass bg-background/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-4 h-4 text-accent-crimson animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Intel Feed</span>
            </div>
            <div className="space-y-2.5 font-mono text-[10px] text-muted-foreground uppercase">
              <p className="flex justify-between items-center"><span>#JHB_SUB_42</span> <span className="text-accent-crimson bg-accent-crimson/10 px-1.5 rounded">ALERT</span></p>
              <p className="flex justify-between items-center"><span>#CPT_HARBOR_X</span> <span className="text-accent-blue bg-accent-blue/10 px-1.5 rounded">CLEAR</span></p>
              <p className="flex justify-between items-center"><span>#DBN_INTL_HUB</span> <span className="text-accent-gold bg-accent-gold/10 px-1.5 rounded">SCAN</span></p>
            </div>
          </div>
        </div>

        {/* Hotspot Dossier Side Panel */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-6 bottom-6 right-6 w-[340px] glass-card border-border-glass bg-background/80 backdrop-blur-2xl p-8 z-50 shadow-glow-crimson overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[10px] font-bold tracking-widest uppercase rounded border border-accent-crimson/20">
                  Hotspot_ID_{selectedHotspot.id}
                </div>
                <button 
                  onClick={() => setSelectedHotspot(null)}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close [ESC]
                </button>
              </div>

              <h3 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-foreground">{selectedHotspot.name}</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase">Coord_Sync: {selectedHotspot.x}, {selectedHotspot.y}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-accent-crimson" /> Tactical Safety Index
                  </p>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex-1 h-2 bg-bg-glass-heavy rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent-crimson shadow-glow-crimson"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedHotspot.risk}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-xl font-bold font-mono tracking-tighter text-accent-crimson">{selectedHotspot.risk}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border-glass pb-2">Operational Metrics</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground">Total Incidents</span>
                    <span className="text-lg font-bold font-mono tracking-tighter text-foreground">{selectedHotspot.incidents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground">Anomaly Weight</span>
                    <span className="text-[11px] font-mono text-accent-gold font-bold">SEVERE</span>
                  </div>
                  <button className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-foreground text-background rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-accent-crimson hover:text-white transition-all group">
                    View Sector Audit <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Summary HUD */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {[
          { label: "Monitored Hotspots", value: "324", icon: <Target className="w-4 h-4 text-accent-crimson" /> },
          { label: "National Risk Index", value: "CRITICAL", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
          { label: "Surveillance Uptime", value: "99.8%", icon: <Zap className="w-4 h-4 text-accent-blue" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-5 border-border-glass bg-bg-glass flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">{item.label}</span>
              <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
            </div>
            <div className="p-3 bg-bg-glass-heavy rounded-xl border border-border-glass">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
