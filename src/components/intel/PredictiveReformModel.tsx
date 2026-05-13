'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Activity,
  History,
  ShieldAlert,
  Network,
  ChevronRight
} from 'lucide-react';

const REFORM_NODES = [
  { name: "OPI Constitutional Amendment", baseDays: 730, elapsed: 245, difficulty: 0.95, momentum: 0.15 },
  { name: "Protected Disclosures Bill (2026)", baseDays: 365, elapsed: 182, difficulty: 0.6, momentum: 0.45 },
  { name: "SIU-to-OPI Operational Transfer", baseDays: 540, elapsed: 310, difficulty: 0.4, momentum: 0.65 }
];

const INFILTRATION_DATA = [
  {
    name: "Crime Intelligence (SAPS)",
    score: 100,
    status: "CRITICAL",
    factors: ["Direct syndicate link identified", "High-risk institutional sector", "Indirect connection to nucleus (1st degree)"]
  },
  {
    name: "Global Alpha Shell Ltd",
    score: 95,
    status: "CRITICAL",
    factors: ["Direct syndicate link identified", "High-risk PEP in leadership", "Indirect connection to nucleus (1st degree)"]
  },
  {
    name: "DPCI (Hawks) Gauteng",
    score: 85,
    status: "CRITICAL",
    factors: ["Direct syndicate link identified", "High-risk PEP in leadership", "High-risk institutional sector"]
  },
  {
    name: "Spares Oasis",
    score: 80,
    status: "CRITICAL",
    factors: ["Direct syndicate link identified", "Indirect connection to nucleus (1st degree)"]
  },
  {
    name: "Medicare 24",
    score: 75,
    status: "HIGH",
    factors: ["Direct syndicate link identified", "Fraudulent contract history (R360m)"]
  }
];

export const PredictiveReformModel = () => {
  const [activeTab, setActiveTab] = useState<'reform' | 'infiltration'>('infiltration');

  const reformPredictions = useMemo(() => {
    return REFORM_NODES.map(node => {
      const remainingDays = Math.max(30, Math.round(((node.baseDays - node.elapsed) * node.difficulty) / (node.momentum || 0.1)));
      const probability = Math.round((node.momentum * (1 - node.difficulty / 2)) * 100);
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + remainingDays);
      return {
        ...node,
        remainingDays,
        probability,
        completionDate: completionDate.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
      };
    });
  }, []);

  return (
    <div className="glass-card border border-white/10 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent-blue">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Predictive Intel Engine</h3>
            </div>
            <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest leading-tight">Syndicate Proximity & Reform Forecast v0.9</p>
          </div>
          <div className="px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/10 flex items-center gap-2">
            <Activity className="w-3 h-3 text-accent-blue animate-pulse" />
            <span className="text-[9px] font-bold text-accent-blue uppercase tracking-tighter">Big Five Nucleus Sync</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('infiltration')}
            className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'infiltration' 
                ? 'bg-accent-crimson border-accent-crimson text-white shadow-glow-crimson-sm' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            Syndicate Infiltration
          </button>
          <button 
            onClick={() => setActiveTab('reform')}
            className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'reform' 
                ? 'bg-accent-blue border-accent-blue text-white shadow-glow-blue-sm' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            Reform Trajectory
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'infiltration' ? (
          <div className="space-y-4">
            {INFILTRATION_DATA.map((node, i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-3 group hover:bg-white/[0.05] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                      <ShieldAlert className={`w-3 h-3 ${node.score > 80 ? 'text-accent-crimson' : 'text-accent-gold'}`} />
                      {node.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        node.status === 'CRITICAL' ? 'bg-accent-crimson text-white' : 'bg-accent-gold text-black'
                      }`}>
                        {node.status} PROXIMITY
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono tracking-tighter text-white">{node.score}%</span>
                    <p className="text-[7px] text-white/20 uppercase font-bold">Infiltration Prob.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {node.factors.map((factor, j) => (
                    <div key={j} className="flex items-center gap-2 text-[9px] text-white/40 font-medium">
                      <ChevronRight className="w-2.5 h-2.5 text-accent-crimson" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {reformPredictions.map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{p.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-white/30 uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>Est. {p.completionDate}</span>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                        p.probability > 60 ? 'bg-green-500/20 text-green-400' : 'bg-accent-gold/20 text-accent-gold'
                      }`}>
                        {p.probability}% Confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-white tracking-tighter">{p.remainingDays}d</div>
                    <div className="text-[7px] text-white/20 uppercase font-bold text-nowrap">Days Rem.</div>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      p.probability > 60 ? 'bg-green-500' : 'bg-accent-gold'
                    }`}
                    style={{ width: `${(p.elapsed / p.baseDays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10 flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
          <History className="w-4 h-4 text-white/40" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Model Variance Weighting</p>
          <p className="text-[10px] text-white/60 italic leading-tight">
            "Proximity weighted by Big Five relationship graph and SCM tender anomaly history."
          </p>
        </div>
      </div>
    </div>
  );
};
