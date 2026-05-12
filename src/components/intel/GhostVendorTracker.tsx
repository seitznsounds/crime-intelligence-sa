'use client';

import React from 'react';
import { 
  Ghost, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Search
} from 'lucide-react';

const DEPARTMENT_DATA = [
  { 
    name: "Eastern Cape Provincial", 
    arrears: "R 3.8 Bn", 
    invoices: 46583, 
    avgResponseDays: 142, 
    riskScore: 98,
    concealmentIndex: "CRITICAL"
  },
  { 
    name: "National DOJ&CD", 
    arrears: "R 2.1 Bn", 
    invoices: 12490, 
    avgResponseDays: 89, 
    riskScore: 82,
    concealmentIndex: "HIGH"
  },
  { 
    name: "Gauteng Provincial", 
    arrears: "R 1.2 Bn", 
    invoices: 8922, 
    avgResponseDays: 64, 
    riskScore: 71,
    concealmentIndex: "ELEVATED"
  },
  { 
    name: "KZN Provincial", 
    arrears: "R 0.9 Bn", 
    invoices: 6511, 
    avgResponseDays: 52, 
    riskScore: 65,
    concealmentIndex: "MODERATE"
  }
];

export const GhostVendorTracker = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-crimson">
            <Ghost className="w-5 h-5 animate-pulse" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Ghost Vendor Tracker</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Administrative Concealment Audit v1.4</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-accent-crimson/30 bg-accent-crimson/10 flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent-crimson animate-pulse" />
          <span className="text-[9px] font-bold text-accent-crimson uppercase">Live SCM Monitoring</span>
        </div>
      </div>

      {/* RISK SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase">Total Arrears (30+ Days)</span>
            <AlertTriangle className="w-4 h-4 text-accent-crimson" />
          </div>
          <div className="text-2xl font-black font-mono tracking-tighter">R 12.4 Bn</div>
          <div className="flex items-center gap-1 text-[9px] text-accent-crimson">
            <TrendingUp className="w-3 h-3" />
            <span>+14% from Q1 2025</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase">Avg Response Lag</span>
            <Clock className="w-4 h-4 text-accent-gold" />
          </div>
          <div className="text-2xl font-black font-mono tracking-tighter">87 Days</div>
          <p className="text-[8px] text-white/30 uppercase tracking-tighter font-mono italic">PFMA Section 38(1)(f) Deviation</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase">Ghost Risk Factor</span>
            <Search className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="text-2xl font-black font-mono tracking-tighter text-accent-crimson">78.4%</div>
          <p className="text-[8px] text-white/30 uppercase tracking-tighter font-mono italic">Probability of Fund Redirection</p>
        </div>
      </div>

      {/* DEPARTMENTAL BREAKDOWN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">High-Risk Departmental Nodes</span>
          <span className="text-[10px] font-bold text-accent-blue uppercase cursor-pointer hover:underline">View Forensic Map</span>
        </div>
        <div className="space-y-2">
          {DEPARTMENT_DATA.map((dept, i) => (
            <div key={i} className="group p-3 rounded-xl border border-white/5 bg-black/40 hover:border-white/20 transition-all cursor-crosshair">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-6 rounded-full ${dept.concealmentIndex === 'CRITICAL' ? 'bg-accent-crimson' : 'bg-accent-gold'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{dept.name}</h4>
                    <p className="text-[9px] text-white/30 font-mono">{dept.invoices.toLocaleString()} INVOICES PENDING</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black font-mono text-accent-crimson tracking-tighter">{dept.arrears}</div>
                  <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest">{dept.avgResponseDays} DAY LAG</div>
                </div>
              </div>
              
              <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between text-[9px] uppercase font-bold text-white/40">
                  <span>Concealment Risk Score</span>
                  <span>{dept.riskScore}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${dept.riskScore > 90 ? 'bg-accent-crimson' : 'bg-accent-gold'}`}
                    style={{ width: `${dept.riskScore}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[8px] text-accent-crimson italic pt-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Administrative Concealment Pathology Detected in SCM Cycle</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-accent-crimson/5 border border-accent-crimson/20 rounded-lg">
        <p className="text-[9px] text-accent-crimson/70 leading-tight italic font-mono">
          "SCM Response Times &gt; 30 Days are used as camouflage for fund siphoning. By the time 
          payment is finalized (90-140 days), the original requisition trail has been sanitized 
          or redirected to offshore shells." — Forensic Intel Memo #024
        </p>
      </div>
    </div>
  );
};
