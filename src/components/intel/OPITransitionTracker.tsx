'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, AlertCircle, Zap, CheckCircle2 } from 'lucide-react';

export default function OPITransitionTracker() {
  const milestones = [
    { year: "2025", title: "Legislative Drafting", status: "COMPLETED", icon: CheckCircle2, color: "text-emerald-400" },
    { year: "2026", title: "Chapter 9 Entrenchment", status: "IN PROGRESS", icon: Clock, color: "text-accent-gold" },
    { year: "2027", title: "SIU Absorption", status: "PENDING", icon: AlertCircle, color: "text-slate-500" },
    { year: "2028", title: "Operational Sovereignty", status: "PENDING", icon: ShieldCheck, color: "text-slate-500" }
  ];

  return (
    <div className="glass-card p-8 border border-white/10 bg-bg-glass overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-gold/20 rounded-lg">
            <Clock className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">OPI Transition Timeline</h3>
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">3-Year Institutional Pivot</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-full text-[8px] font-black text-accent-gold uppercase tracking-[0.2em] animate-pulse">
          Active Vacuum
        </div>
      </div>

      <div className="relative space-y-8">
        <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-white/5" />
        
        {milestones.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 relative z-10"
          >
            <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-background/80 backdrop-blur-md ${step.color}`}>
              <step.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground">{step.year}</span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${step.color}`}>{step.status}</span>
              </div>
              <p className="text-sm font-bold text-foreground tracking-tight">{step.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-accent-crimson/5 border border-accent-crimson/20 rounded-xl flex items-start gap-3">
        <Zap className="w-4 h-4 text-accent-crimson shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-accent-crimson uppercase mb-1">Vacuum Warning</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            NACAC 2025 finding: The 3-year gap between SIU status and OPI independence creates a "Shadow Window" for evidence destruction.
          </p>
        </div>
      </div>
    </div>
  );
}
