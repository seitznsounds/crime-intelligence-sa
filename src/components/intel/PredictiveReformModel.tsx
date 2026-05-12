'use client';

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Activity,
  History
} from 'lucide-react';

const REFORM_NODES = [
  {
    name: "OPI Constitutional Amendment",
    baseDays: 730,
    elapsed: 245,
    difficulty: 0.95, // 2/3 majority requirement
    momentum: 0.15, // Stalled in committee
    budget: true
  },
  {
    name: "Protected Disclosures Bill (2026)",
    baseDays: 365,
    elapsed: 182,
    difficulty: 0.6, // Simple majority
    momentum: 0.45, // Active deliberations
    budget: true
  },
  {
    name: "SIU-to-OPI Operational Transfer",
    baseDays: 540,
    elapsed: 310,
    difficulty: 0.4, // Administrative mainly
    momentum: 0.65, // Ongoing absorption
    budget: true
  },
  {
    name: "Whistleblower Protector Appointment",
    baseDays: 270,
    elapsed: 45,
    difficulty: 0.5, // Presidential prerogative
    momentum: 0.25, // Search phase
    budget: false
  }
];

export const PredictiveReformModel = () => {
  const predictions = useMemo(() => {
    return REFORM_NODES.map(node => {
      // Logic: Probability decreases with difficulty and increases with momentum
      // Estimated days remaining: (Base * Difficulty) / Momentum
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
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-wrap">Predictive Reform Modeling</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest text-wrap leading-tight">Legislative Completion Probability v0.8</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 flex items-center gap-2">
          <Activity className="w-3 h-3 text-green-400 animate-pulse" />
          <span className="text-[9px] font-bold text-green-400 uppercase">Live Model Sync</span>
        </div>
      </div>

      <div className="space-y-6">
        {predictions.map((p, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{p.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[8px] font-bold text-white/30 uppercase">
                    <Calendar className="w-3 h-3" />
                    <span>Est. Completion: {p.completionDate}</span>
                  </div>
                  <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                    p.probability > 60 ? 'bg-green-500/20 text-green-400' : 
                    p.probability > 30 ? 'bg-accent-gold/20 text-accent-gold' : 'bg-accent-crimson/20 text-accent-crimson'
                  }`}>
                    {p.probability}% Confidence
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black font-mono text-white tracking-tighter">{p.remainingDays}d</div>
                <div className="text-[7px] text-white/20 uppercase font-bold">Days Remaining</div>
              </div>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  p.probability > 60 ? 'bg-green-500' : 
                  p.probability > 30 ? 'bg-accent-gold' : 'bg-accent-crimson'
                }`}
                style={{ width: `${(p.elapsed / p.baseDays) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[8px] uppercase font-bold text-white/20 font-mono">
              <span>Elapsed: {p.elapsed}d</span>
              <span>Baseline: {p.baseDays}d</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-white/40">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Model Variance Factors</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase font-bold">Committee Friction</p>
            <div className="text-xs font-black text-accent-crimson">HIGH (0.82)</div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase font-bold">Political Will Index</p>
            <div className="text-xs font-black text-accent-gold">VOLATILE (0.44)</div>
          </div>
        </div>
      </div>

      <p className="text-[9px] text-white/30 leading-tight italic text-center">
        "Model trained on 15 years of Parliamentary CJS history and the 'Zondo Backlash' factor. 
        Predictions assume no Cabinet reshuffle within the 2026 window."
      </p>
    </div>
  );
};
