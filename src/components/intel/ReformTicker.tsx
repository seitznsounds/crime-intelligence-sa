'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Gavel, 
  Users, 
  Scale, 
  FileCheck,
  Zap,
  ArrowRight,
  Target,
  AlertCircle
} from 'lucide-react';

const REFORM_DATA = [
  {
    pillar: "Institutional Architecture",
    reform: "Establishment of the Office of Public Integrity (OPI)",
    status: "PROPOSED",
    source: "NACAC Aug 2025",
    progress: 15,
    icon: ShieldCheck,
    color: "text-accent-blue"
  },
  {
    pillar: "Whistleblower Protection",
    reform: "Appointment of Retired Judge as Whistleblower Protector",
    status: "IN PROGRESS",
    source: "PDA Reform 2026",
    progress: 45,
    icon: Gavel,
    color: "text-accent-gold"
  },
  {
    pillar: "Legislative Reform",
    reform: "Criminalization of Whistleblower Retaliation",
    status: "DEBATED",
    source: "PD Bill 2026",
    progress: 30,
    icon: AlertCircle,
    color: "text-accent-crimson"
  },
  {
    pillar: "Transparency",
    reform: "Strengthening Political Party Funding Act (PPFA)",
    status: "STALLED",
    source: "NACS Pillar 4",
    progress: 5,
    icon: Users,
    color: "text-white/30"
  },
  {
    pillar: "Procurement Reform",
    reform: "Professionalization of SCM Officers & E-Procurement",
    status: "PILOTING",
    source: "Procurement Bill 2025",
    progress: 65,
    icon: FileCheck,
    color: "text-green-400"
  },
  {
    pillar: "Asset Recovery",
    reform: "Incentivized Disclosures (15-25% Reward Range)",
    status: "SIMULATED",
    source: "Zondo/OECD Benchmarks",
    progress: 100,
    icon: Zap,
    color: "text-accent-blue"
  }
];

export const ReformTicker = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-blue" />
            National Reform Ticker
          </h3>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Legislative Progress Tracking v2.0</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em]">Source: NACAC 2025 Audit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REFORM_DATA.map((reform, i) => {
          const Icon = reform.icon;
          return (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg bg-black/40 ${reform.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{reform.pillar}</span>
                    <h4 className="text-sm font-bold text-white/90 leading-tight pr-4">{reform.reform}</h4>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${
                  reform.status === 'DEBATED' ? 'border-accent-crimson/50 text-accent-crimson' :
                  reform.status === 'STALLED' ? 'border-white/10 text-white/20' :
                  reform.status === 'PILOTING' ? 'border-green-500/50 text-green-400' :
                  'border-accent-blue/50 text-accent-blue'
                }`}>
                  {reform.status}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/30 italic">Target: {reform.source}</span>
                  <span className="text-white/60 font-bold">{reform.progress}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      reform.status === 'STALLED' ? 'bg-white/20' :
                      reform.status === 'DEBATED' ? 'bg-accent-crimson' :
                      'bg-accent-blue'
                    }`}
                    style={{ width: `${reform.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-white/30 group-hover:text-white/60 transition-colors cursor-pointer">
                <span className="uppercase tracking-widest flex items-center gap-1">
                  View Detailed Advisory <ArrowRight className="w-3 h-3" />
                </span>
                <span className="italic">Impact Weighted: High</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-accent-blue">
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">OPI Transition Trigger</span>
        </div>
        <p className="text-[10px] text-white/60 leading-relaxed italic">
          "The establishment of the Office of Public Integrity (OPI) as a Chapter 9 body is the single point 
          of failure for the National Anti-Corruption Strategy. Without the OPI absorbing SIU resources, 
          reform remains at the policy level without enforcement muscle." — NACAC Final Report 2025
        </p>
      </div>
    </div>
  );
};
