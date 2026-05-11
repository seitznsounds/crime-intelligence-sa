"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, ShieldAlert, Target, Activity, Map as MapIcon, ChevronRight, Zap } from "lucide-react";

const HOTSPOTS = [
  { id: 1, name: "Johannesburg Central", x: 620, y: 320, risk: 94, incidents: 12402 },
  { id: 2, name: "Cape Town Metro", x: 180, y: 780, risk: 88, incidents: 9541 },
  { id: 3, name: "Durban Port", x: 780, y: 480, risk: 91, incidents: 8203 },
  { id: 4, name: "Pretoria North", x: 630, y: 280, risk: 72, incidents: 5430 },
  { id: 5, name: "Port Elizabeth", x: 520, y: 820, risk: 65, incidents: 3102 },
];

export default function CrimeMapPage() {
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-hidden selection:bg-accent-crimson/30 font-sans">
      {/* Cinematic Map Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff3b3003,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Main Map Container */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-20">
        <motion.div 
          className="relative w-full max-w-5xl aspect-[4/3]"
          initial={{ opacity: 0, rotateX: 20, scale: 0.9 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: "1000px" }}
        >
          <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-[0_0_50px_rgba(255,59,48,0.05)]">
            {/* South Africa Stylized Map Path (Simplified) */}
            <motion.path 
              d="M200,750 L150,850 L250,950 L550,900 L850,550 L800,250 L650,150 L350,150 L200,450 Z" 
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Heat Gradients */}
            {HOTSPOTS.map((spot) => (
              <g key={spot.id}>
                <motion.circle 
                  cx={spot.x} cy={spot.y} r="60"
                  className="fill-[radial-gradient(circle,rgba(255,59,48,0.1)_0%,transparent_70%)]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: spot.id * 0.5 }}
                />
                <motion.circle 
                  cx={spot.x} cy={spot.y} r="4" 
                  className="fill-accent-crimson shadow-glow"
                  onClick={() => setSelectedHotspot(spot)}
                />
                <circle 
                  cx={spot.x} cy={spot.y} r="15" 
                  className="fill-transparent stroke-accent-crimson/20 cursor-pointer group hover:stroke-accent-crimson transition-all"
                  onClick={() => setSelectedHotspot(spot)}
                />
              </g>
            ))}
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-0 right-0 p-8 space-y-4">
            <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all backdrop-blur-md">
              <Zap className="w-3.5 h-3.5" /> High Precision Mode
            </button>
            <button className="flex items-center gap-3 px-4 py-2 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-accent-crimson transition-all backdrop-blur-md">
              <Target className="w-3.5 h-3.5" /> Recalibrate Hotspots
            </button>
          </div>
        </motion.div>

        {/* Tactical HUD Left */}
        <div className="absolute top-20 left-20 space-y-8 max-w-sm pointer-events-none">
          <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-accent-crimson/10 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-accent-crimson" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tighter uppercase">Geospatial Intelligence</h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">Operational Status: ACTIVE</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Active Hotspots", value: "324", color: "text-accent-crimson" },
                { label: "Regional Risk Index", value: "CRITICAL", color: "text-accent-gold" },
                { label: "Surveillance Load", value: "94.2%", color: "text-accent-blue" }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.03]">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{m.label}</span>
                  <span className={`text-[11px] font-mono font-bold ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 bg-black/40 backdrop-blur-lg">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-4 h-4 text-white/20 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Live Intercept Feed</span>
            </div>
            <div className="space-y-3 font-mono text-[9px] text-white/40 uppercase">
              <p className="flex justify-between"><span>#JHB_SUB_42</span> <span className="text-accent-crimson">ALERT</span></p>
              <p className="flex justify-between"><span>#CPT_HARBOR_X</span> <span className="text-accent-blue">CLEAR</span></p>
              <p className="flex justify-between"><span>#DBN_INTL_HUB</span> <span className="text-accent-gold">SCAN</span></p>
            </div>
          </div>
        </div>

        {/* Hotspot Dossier Overlay */}
        {selectedHotspot && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-20 right-20 w-[400px] glass-card border-white/10 bg-black/60 backdrop-blur-2xl p-10 z-50 shadow-glow-crimson"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[9px] font-bold tracking-widest uppercase rounded border border-accent-crimson/20">
                Hotspot_ID_{selectedHotspot.id}
              </div>
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white"
              >
                Close_Intel [X]
              </button>
            </div>

            <h3 className="text-4xl font-bold tracking-tighter uppercase mb-2">{selectedHotspot.name}</h3>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 text-white/40">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">LAT_LNG: {selectedHotspot.x}, {selectedHotspot.y}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Tactical Safety Index</p>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent-crimson"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedHotspot.risk}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold font-mono tracking-tighter text-accent-crimson">{selectedHotspot.risk}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/20">
                  <span>HISTORICAL_VOLATILITY</span>
                  <span className="text-white/60">HIGH</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Incident Breakdown</p>
                <div className="flex justify-between items-center py-3 border-b border-white/[0.03]">
                  <span className="text-xs font-bold uppercase tracking-tight">Total Crimes</span>
                  <span className="text-sm font-bold font-mono tracking-tighter text-white/80">{selectedHotspot.incidents.toLocaleString()}</span>
                </div>
                <button className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all group">
                  Open Detailed Sector Audit <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Tactical Switcher */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 glass-card px-10 py-5 border-white/5 bg-black/40 backdrop-blur-md z-40">
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-crimson group">
          <MapIcon className="w-4 h-4" /> <span className="group-hover:tracking-[0.4em] transition-all">Tactical Map</span>
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all group">
          <Activity className="w-4 h-4" /> <span className="group-hover:tracking-[0.4em] transition-all">Live Sensors</span>
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all group">
          <Target className="w-4 h-4" /> <span className="group-hover:tracking-[0.4em] transition-all">Target Sync</span>
        </button>
      </div>
    </div>
  );
}
