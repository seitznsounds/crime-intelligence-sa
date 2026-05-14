'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radar, ShieldCheck, Activity, TrendingUp, AlertCircle, Ban } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Activity,
  AlertCircle,
  Ban,
  TrendingUp
};

export default function OversightRadar({ initialMetrics }: { initialMetrics: any[] }) {
  const [metrics, setMetrics] = React.useState(initialMetrics);

  return (
    <div className="glass-card p-6 border border-white/10 bg-bg-glass overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-blue/20 rounded-lg">
          <Radar className="w-5 h-5 text-accent-blue animate-pulse" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Oversight Radar</h3>
          <p className="text-[9px] font-mono text-muted-foreground uppercase">Institutional Decay Tracking v5.0</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, i) => {
          const Icon = ICON_MAP[metric.icon] || AlertCircle;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-3 h-3 ${metric.color}`} />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight truncate">{metric.label}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className={`text-lg font-mono font-black tracking-tighter ${metric.color}`}>{metric.value}</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60 tracking-widest">{metric.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Global Integrity Score</span>
          <span className="text-xs font-mono font-bold text-accent-crimson">3.2/10</span>
        </div>
        <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "32%" }}
            className="h-full bg-accent-crimson"
          />
        </div>
      </div>
    </div>
  );
}
