'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ban, ShieldAlert, AlertTriangle, TrendingUp, Users, Lock } from 'lucide-react';

interface WpuTrackerProps {
  data: {
    vacancy_rate: string;
    funding_deficit: string;
    protection_paradox: string;
    zondo_alignment: string;
    risk_score: number;
    status: string;
  }
}

export default function WpuTracker({ data }: WpuTrackerProps) {
  return (
    <div className="glass-card p-8 border-accent-crimson/20 bg-bg-glass overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 text-accent-crimson opacity-5">
        <ShieldAlert className="w-32 h-32" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 border border-accent-crimson/20 rounded mb-3">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent-crimson animate-pulse">Critical Institutional Deficit</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tighter uppercase">WPU Vacancy & Funding Audit</h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Entity: Witness Protection Unit // Status: {data.status}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Protection_Risk</p>
            <p className="text-4xl font-black font-mono text-accent-crimson tracking-tighter">{data.risk_score}/10</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-gold" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Leadership Vacancy</span>
              </div>
              <span className="text-xl font-bold font-mono text-accent-gold">{data.vacancy_rate}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: data.vacancy_rate }}
                className="h-full bg-accent-gold"
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">"The 'Dual Home' arrangement leads to a perpetual leadership vacuum."</p>
          </div>

          <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-crimson" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Funding Deficit</span>
              </div>
              <span className="text-xl font-bold font-mono text-accent-crimson">{data.funding_deficit}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                className="h-full bg-accent-crimson"
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">"Lethal funding gaps identified in PPLAAF Forensic Audit 2026."</p>
          </div>
        </div>

        <div className="p-6 bg-accent-crimson/5 border border-accent-crimson/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent-crimson" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-crimson">The Protection-Implementation Paradox</h4>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {data.protection_paradox}
          </p>
          <div className="mt-4 flex items-center gap-4 pt-4 border-t border-white/5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Zondo Alignment:</span>
            <span className="text-[10px] font-mono font-bold text-accent-gold">{data.zondo_alignment}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
