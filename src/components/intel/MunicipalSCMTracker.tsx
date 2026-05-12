'use client';

import React from 'react';
import { 
  Building2, 
  AlertCircle, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from 'lucide-react';

const METRO_DATA = [
  { 
    name: "City of Johannesburg", 
    arrears: "R 1.4 Bn", 
    irregular: "R 2.1 Bn", 
    avgLag: 84, 
    risk: 88,
    status: "CRITICAL"
  },
  { 
    name: "City of Tshwane", 
    arrears: "R 0.9 Bn", 
    irregular: "R 1.8 Bn", 
    avgLag: 92, 
    risk: 91,
    status: "CRITICAL"
  },
  { 
    name: "eThekwini Metro", 
    arrears: "R 1.1 Bn", 
    irregular: "R 1.5 Bn", 
    avgLag: 76, 
    risk: 74,
    status: "HIGH"
  },
  { 
    name: "Ekurhuleni Metro", 
    arrears: "R 0.7 Bn", 
    irregular: "R 0.9 Bn", 
    avgLag: 62, 
    risk: 58,
    status: "ELEVATED"
  },
  { 
    name: "City of Cape Town", 
    arrears: "R 0.2 Bn", 
    irregular: "R 0.1 Bn", 
    avgLag: 28, 
    risk: 12,
    status: "GOOD"
  }
];

export const MunicipalSCMTracker = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-gold">
            <Building2 className="w-5 h-5" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Metro Drill-Down (Big Five)</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest text-wrap">Procurement Audit Discrepancy Tracking</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-accent-gold/30 bg-accent-gold/10 flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-accent-gold" />
          <span className="text-[9px] font-bold text-accent-gold uppercase">Audit Integrity Level: 64%</span>
        </div>
      </div>

      <div className="space-y-3">
        {METRO_DATA.map((metro, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg bg-black/40 ${
                  metro.status === 'CRITICAL' ? 'text-accent-crimson' : 
                  metro.status === 'GOOD' ? 'text-green-400' : 'text-accent-gold'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{metro.name}</h4>
                  <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">SCM Audit Cycle 2025</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${
                metro.status === 'CRITICAL' ? 'border-accent-crimson/50 text-accent-crimson' :
                metro.status === 'GOOD' ? 'border-green-500/50 text-green-400' :
                'border-accent-gold/50 text-accent-gold'
              }`}>
                {metro.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/20 uppercase">Arrears</span>
                <div className="text-xs font-black font-mono text-white/90">{metro.arrears}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/20 uppercase">Irregular</span>
                <div className="text-xs font-black font-mono text-accent-gold">{metro.irregular}</div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[8px] font-bold text-white/20 uppercase">Avg Lag</span>
                <div className="text-xs font-black font-mono text-white/90">{metro.avgLag}d</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-white/30 uppercase">Ghost Vendor Probability</span>
                <span className={metro.risk > 80 ? 'text-accent-crimson' : 'text-white/60'}>{metro.risk}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    metro.risk > 80 ? 'bg-accent-crimson' : 
                    metro.risk < 20 ? 'bg-green-500' : 'bg-accent-gold'
                  }`}
                  style={{ width: `${metro.risk}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-accent-blue" />
          <span className="text-[10px] font-bold text-white/60 uppercase">Search Specific Contractor Discrepancies</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  );
};
