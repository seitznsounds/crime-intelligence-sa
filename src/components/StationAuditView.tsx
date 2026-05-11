"use client";

import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  AlertTriangle,
  Scale
} from "lucide-react";

interface StationAuditViewProps {
  station: any;
  otherStats: any[] | null;
}

export function StationAuditView({ station, otherStats }: StationAuditViewProps) {
  return (
    <>
      {/* Audit Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { 
            label: "Primary Crime Category", 
            value: station.category, 
            sub: "High Impact Threat", 
            icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" />,
            color: "text-accent-crimson"
          },
          { 
            label: "Reported Volume", 
            value: station.incident_count, 
            sub: "Quarterly Indexed Total", 
            icon: <Target className="w-4 h-4 text-accent-gold" />,
            color: "text-accent-gold"
          },
          { 
            label: "Operational Integrity", 
            value: "B- GRADE", 
            sub: "Data Consistency Score", 
            icon: <Scale className="w-4 h-4 text-accent-blue" />,
            color: "text-accent-blue"
          }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 border-white/5 bg-white/[0.01]"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{item.label}</span>
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">{item.icon}</div>
            </div>
            <p className={`text-2xl font-bold tracking-tighter mb-2 uppercase ${item.color}`}>{item.value}</p>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
            <Activity className="w-4 h-4" /> Category Distribution Analysis
          </h3>
          <div className="space-y-6">
            {otherStats?.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.category}</span>
                  <span className="text-[10px] font-mono text-white/40">{s.incident_count} CASES</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${i === 0 ? 'bg-accent-crimson' : 'bg-white/20'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((s.incident_count || 0) / (station.incident_count || 1) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 border-accent-gold/10 bg-accent-gold/[0.01]"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold/60 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Operational Anomalies
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <TrendingUp className="w-4 h-4 text-accent-crimson shrink-0 mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-1">Unusual Reporting Decline</p>
                  <p className="text-[10px] text-white/40 leading-relaxed font-light">Detected 12.4% drop in case registration without corresponding crime reduction indices.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingDown className="w-4 h-4 text-accent-blue shrink-0 mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-1">Conviction Efficiency Lag</p>
                  <p className="text-[10px] text-white/40 leading-relaxed font-light">Station conviction rates are 4.2% below district average for high-priority offenses.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            Request Full Station Corruption Audit
          </button>
        </section>
      </div>
    </>
  );
}
