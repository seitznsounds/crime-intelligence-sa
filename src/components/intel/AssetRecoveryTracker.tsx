'use client';

import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Activity,
  Search,
  Scale
} from 'lucide-react';

const RECOVERY_CASES = [
  { 
    id: "AFU-UK-001", 
    asset: "Properties & Bank Accounts", 
    target: "United Kingdom", 
    value: "R 2.4 Bn", 
    phase: "FREEZING", 
    progress: 45, 
    mla: "APPROVED",
    risk: "LOW"
  },
  { 
    id: "AFU-UAE-002", 
    asset: "Luxury Assets & Shells", 
    target: "UAE (Dubai)", 
    value: "R 4.8 Bn", 
    phase: "DETECTION", 
    progress: 15, 
    mla: "PENDING",
    risk: "CRITICAL"
  },
  { 
    id: "AFU-CH-003", 
    asset: "Sovereign Fund Diverted", 
    target: "Switzerland", 
    value: "R 1.2 Bn", 
    phase: "CONFISCATION", 
    progress: 75, 
    mla: "FINALIZED",
    risk: "LOW"
  },
  { 
    id: "AFU-US-004", 
    asset: "Procurement Kickbacks", 
    target: "USA (Delaware)", 
    value: "R 0.9 Bn", 
    phase: "RETURN", 
    progress: 92, 
    mla: "FINALIZED",
    risk: "MINIMAL"
  }
];

export const AssetRecoveryTracker = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-blue">
            <Scale className="w-5 h-5" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Cross-Border Asset Tracker</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest text-wrap leading-tight">UNCAC Chapter V Compliance Monitor</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/10 flex items-center gap-2">
          <Globe className="w-3 h-3 text-accent-blue" />
          <span className="text-[9px] font-bold text-accent-blue uppercase">Global Recovery Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RECOVERY_CASES.map((caseItem, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg bg-black/40 ${caseItem.phase === 'RETURN' ? 'text-green-400' : 'text-accent-blue'}`}>
                  {caseItem.phase === 'DETECTION' ? <Search className="w-4 h-4" /> : 
                   caseItem.phase === 'FREEZING' ? <Lock className="w-4 h-4" /> : 
                   caseItem.phase === 'CONFISCATION' ? <ShieldCheck className="w-4 h-4" /> : 
                   <Unlock className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{caseItem.asset}</h4>
                  <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{caseItem.target} | {caseItem.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-white tracking-tighter">{caseItem.value}</div>
                <div className={`text-[8px] font-black tracking-widest uppercase ${
                  caseItem.mla === 'PENDING' ? 'text-accent-crimson' : 'text-green-400'
                }`}>MLA: {caseItem.mla}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-white/30 uppercase italic">{caseItem.phase} PHASE</span>
                <span className="text-white/60">{caseItem.progress}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    caseItem.phase === 'RETURN' ? 'bg-green-500' : 'bg-accent-blue'
                  }`}
                  style={{ width: `${caseItem.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-accent-gold" />
          <span className="text-[10px] font-bold text-white/60 uppercase">Net Recovery Efficiency: 1.4%</span>
        </div>
        <p className="text-[9px] text-white/30 italic">BRICS 2024 Baseline Target: 15%</p>
      </div>

      <button className="w-full py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-[10px] font-black uppercase tracking-widest text-accent-blue hover:bg-accent-blue/20 transition-all flex items-center justify-center gap-2">
        Initiate Mutual Legal Assistance Request <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
