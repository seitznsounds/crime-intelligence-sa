'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Gavel, 
  Scale, 
  FileText,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

const MILESTONES = [
  {
    name: "Constitutional Amendment (Chapter 9)",
    desc: "Requires 2/3 majority for institutional independence.",
    status: "STALLED",
    progress: 10,
    icon: Lock,
    date: "Est. Q4 2026"
  },
  {
    name: "SIU Institutional Absorption",
    desc: "Transfer of mission, powers, and 1400+ staff.",
    status: "IN PROGRESS",
    progress: 45,
    icon: ShieldCheck,
    date: "Est. Q2 2026"
  },
  {
    name: "Whistleblower Protector Appointment",
    desc: "Selection of retired judge as national lead.",
    status: "PENDING",
    progress: 5,
    icon: Gavel,
    date: "Est. Q3 2025"
  },
  {
    name: "Treasury Fund Appropriation",
    desc: "R1.2 Bn baseline funding for OPI infrastructure.",
    status: "STALLED",
    progress: 0,
    icon: Scale,
    date: "Est. Q1 2026"
  },
  {
    name: "Protected Disclosures Bill (2026)",
    desc: "Legislative framework for criminalizing retaliation.",
    status: "DEBATED",
    progress: 30,
    icon: FileText,
    date: "Est. Q2 2026"
  }
];

export const OPITransitionTracker = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-blue">
            <Zap className="w-5 h-5 animate-pulse" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-wrap">OPI Transition Trigger</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Legislative Milestone Tracker v1.2</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/10 flex items-center gap-2">
          <Clock className="w-3 h-3 text-accent-blue" />
          <span className="text-[9px] font-bold text-accent-blue uppercase italic">Transition Window: 2025-2028</span>
        </div>
      </div>

      <div className="space-y-4">
        {MILESTONES.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="relative pl-6 border-l border-white/10 group">
              <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-black ${
                m.status === 'DONE' ? 'bg-green-500' : 
                m.status === 'STALLED' ? 'bg-accent-crimson' : 
                m.status === 'IN PROGRESS' ? 'bg-accent-blue' : 'bg-white/20'
              }`} />
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter flex items-center gap-2">
                      <Icon className="w-3 h-3 text-white/40" />
                      {m.name}
                    </h4>
                    <p className="text-[9px] text-white/40 leading-tight pr-8">{m.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black tracking-widest uppercase ${
                      m.status === 'STALLED' ? 'text-accent-crimson' : 'text-accent-blue'
                    }`}>{m.status}</span>
                    <p className="text-[7px] text-white/20 font-mono mt-1">{m.date}</p>
                  </div>
                </div>

                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      m.status === 'STALLED' ? 'bg-accent-crimson' : 'bg-accent-blue'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-accent-crimson flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-accent-crimson uppercase">Leadership Vacuum Warning</p>
          <p className="text-[9px] text-white/60 leading-tight italic">
            Transition lacks a dedicated Constitutional champion. Reliance on political oversight 
            (MoJ&CD) during the 3-year window creates a high probability of institutional drift 
            and capture-backlash. — NACAC Audit Findings #2025-09
          </p>
        </div>
      </div>
    </div>
  );
};
