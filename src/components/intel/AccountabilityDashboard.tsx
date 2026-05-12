
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  Users, 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

const NACS_PILLARS = [
  { id: 1, name: "Citizen Participation", progress: 42, color: "bg-accent-blue" },
  { id: 2, name: "Professional Conduct", progress: 28, color: "bg-accent-gold" },
  { id: 3, name: "Ethical Governance", progress: 35, color: "bg-accent-crimson" },
  { id: 4, name: "Procurement Integrity", progress: 15, color: "bg-accent-blue" },
  { id: 5, name: "Asset Recovery Speed", progress: 22, color: "bg-accent-gold" },
  { id: 6, name: "Witness Protection", progress: 12, color: "bg-accent-crimson" },
];

const REFORM_MILESTONES = [
  { date: "May 2026", event: "Arrest of Major-Generals Khan & Kadwa", status: "SUCCESS", impact: "High" },
  { date: "April 2026", event: "Public Procurement Act Amendment", status: "ENACTED", impact: "Medium" },
  { date: "March 2026", event: "Whistleblower Witness Protection Reform", status: "IN PROGRESS", impact: "Critical" },
  { date: "Jan 2026", event: "NACAC Implementation Dashboard Live", status: "SUCCESS", impact: "Low" }
];

export default function AccountabilityDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">National Accountability Dashboard</h2>
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">CLEAR-AA M&E Framework (Sprint 5 Live)</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2 border-accent-gold/20">
          <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
          <span className="text-[10px] font-bold text-accent-gold uppercase tracking-tighter">Live Audit Context: GNU 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* NACS Progress Index */}
        <div className="xl:col-span-2 glass-card p-8 border-border-glass bg-bg-glass space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-blue" /> NACS Pillar Progress Index
            </h3>
            <Info className="w-4 h-4 text-muted-foreground opacity-30 cursor-help" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {NACS_PILLARS.map((pillar, i) => (
              <div key={pillar.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-foreground/80 uppercase">{pillar.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">{pillar.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pillar.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${pillar.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent-crimson/10 border border-accent-crimson/20">
              <AlertCircle className="w-5 h-5 text-accent-crimson" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-accent-crimson mb-1">Critical Reporting Gap Found</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Procurement Integrity (Pillar 4) lags by 40% against 2026 targets due to delays in SITA integration and SCM vetting backlogs.
              </p>
            </div>
          </div>
        </div>

        {/* Reform Ticker & Impact */}
        <div className="glass-card p-8 border-border-glass bg-bg-glass space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-gold" /> Corruption Reform Ticker
          </h3>

          <div className="space-y-6">
            {REFORM_MILESTONES.map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-6 border-l border-white/10 group"
              >
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-white/20 group-hover:bg-accent-gold transition-colors" />
                <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase">{milestone.date}</div>
                <div className="text-xs font-bold text-foreground/90 group-hover:text-accent-gold transition-colors">{milestone.event}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[8px] font-black px-1 rounded border ${
                    milestone.status === "SUCCESS" ? "border-green-500/50 text-green-400 bg-green-400/5" :
                    milestone.status === "ENACTED" ? "border-accent-blue/50 text-accent-blue bg-accent-blue/5" :
                    "border-accent-gold/50 text-accent-gold bg-accent-gold/5"
                  }`}>
                    {milestone.status}
                  </span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Impact: {milestone.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            View Full Audit Trail <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Brazil-style Transparency Mockup */}
      <div className="glass-card p-10 border-border-glass bg-bg-glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Scale className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.4em]">Transparency Portal v2.0</span>
              <h3 className="text-2xl font-bold tracking-tighter">Public Expenditure Integrity Audit</h3>
            </div>
            <div className="flex gap-8">
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase mb-1">High-Risk Spend</div>
                <div className="text-xl font-bold text-accent-crimson tracking-tighter font-mono">R 12.4 Bn</div>
              </div>
              <div className="text-right border-l border-white/10 pl-8">
                <div className="text-[10px] text-muted-foreground uppercase mb-1">Audited Compliance</div>
                <div className="text-xl font-bold text-accent-blue tracking-tighter font-mono">68.2%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Vetting Compliance", value: 92, status: "GOOD" },
              { label: "Witness Integrity", value: 12, status: "CRITICAL" },
              { label: "Investigation Rate", value: 78, status: "CRITICAL" },
              { label: "Asset Recovery", value: 1, status: "CRITICAL" }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/20 space-y-3">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">{stat.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{stat.value}%</span>
                  <CheckCircle2 className={`w-4 h-4 ${stat.status === "GOOD" ? "text-green-500" : stat.status === "WARNING" ? "text-accent-gold" : "text-accent-crimson"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
