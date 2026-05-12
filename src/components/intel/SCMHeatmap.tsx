'use client';

import React from 'react';
import { 
  Map as MapIcon, 
  AlertTriangle, 
  TrendingDown, 
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';

const PROVINCIAL_SCM_DATA = [
  { id: "EC", name: "Eastern Cape", lag: 142, risk: 98, color: "bg-accent-crimson" },
  { id: "GP", name: "Gauteng", lag: 64, risk: 71, color: "bg-accent-gold" },
  { id: "KZN", name: "KwaZulu-Natal", lag: 52, risk: 65, color: "bg-accent-gold" },
  { id: "LP", name: "Limpopo", lag: 48, risk: 58, color: "bg-accent-blue" },
  { id: "MP", name: "Mpumalanga", lag: 45, risk: 52, color: "bg-accent-blue" },
  { id: "NW", name: "North West", lag: 42, risk: 49, color: "bg-accent-blue" },
  { id: "FS", name: "Free State", lag: 38, risk: 45, color: "bg-accent-blue" },
  { id: "NC", name: "Northern Cape", lag: 35, risk: 42, color: "bg-accent-blue" },
  { id: "WC", name: "Western Cape", lag: 32, risk: 38, color: "bg-green-400" }
];

export const SCMHeatmap = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-blue">
            <MapIcon className="w-5 h-5" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Spatial SCM Risk Map</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest text-wrap">Procurement Failure Nodes by Province</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em]">Data: Materialized View (Q2 2025)</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PROVINCIAL_SCM_DATA.map((prov) => (
          <div 
            key={prov.id} 
            className={`aspect-square p-2 rounded-lg border border-white/5 flex flex-col justify-between group cursor-help hover:border-white/20 transition-all ${prov.color}/10`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/40">{prov.id}</span>
              <Activity className={`w-3 h-3 ${prov.risk > 80 ? 'text-accent-crimson animate-pulse' : 'text-white/20'}`} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold font-mono tracking-tighter">{prov.lag}d</div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${prov.color}`}
                  style={{ width: `${prov.risk}%` }}
                />
              </div>
            </div>
            
            {/* TOOLTIP-LIKE OVERLAY ON HOVER */}
            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-lg flex flex-col justify-center items-center text-center space-y-2 z-10">
              <span className="text-[8px] font-black uppercase text-accent-blue">{prov.name}</span>
              <div className="text-lg font-black font-mono tracking-tighter">{prov.risk}% RISK</div>
              <p className="text-[7px] text-white/50 uppercase leading-tight italic font-mono">
                {prov.lag} day SCM lag indicates critical concealment risk
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-accent-crimson" /> National Performance Gap
            </span>
            <span className="text-[10px] font-bold text-accent-crimson">+110 Days deviation from target</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: '22%' }} />
            <div className="h-full bg-accent-crimson animate-pulse" style={{ width: '78%' }} />
          </div>
          <div className="flex justify-between text-[8px] uppercase font-bold text-white/20">
            <span>Target (30 Days)</span>
            <span>Real-time Lag (142 Days max)</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
          <Info className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-accent-blue uppercase">Spatial Heatmap Logic</p>
            <p className="text-[9px] text-white/60 leading-tight">
              Risk scores are derived from the delta between provincial SCM response times and the PFMA 30-day mandate. 
              Higher lag correlates with a 92% increased probability of "Ghost Vendor" settlement patterns.
            </p>
          </div>
        </div>
      </div>

      <button className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
        Drill Down to Municipal Level <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
