'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ShieldAlert, Zap, Target } from 'lucide-react';

interface TemporalPoint {
  label: string;
  count: number;
  intensity: number; // 0 to 1
}

interface IncidentTemporalMapProps {
  hourlyData: TemporalPoint[];
  monthlyData: TemporalPoint[];
}

export default function TemporalCrimeAnalysis({ hourlyData, monthlyData }: IncidentTemporalMapProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Hourly Distribution (Time of Day) */}
      <div className="glass-card p-8 border-border-glass bg-bg-glass space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-accent-crimson">
            <Clock className="w-4 h-4" /> Hourly Strike Distribution
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">24H Intelligence Window</span>
        </div>

        <div className="relative h-48 flex items-end gap-1 px-2">
          {hourlyData.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent-crimson px-1.5 py-0.5 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {point.count}
              </div>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${point.intensity * 100}%` }}
                className={`w-full rounded-t-sm transition-colors ${
                  // Highlight 02:00 - 05:00 range
                  (parseInt(point.label) >= 2 && parseInt(point.label) <= 5)
                    ? 'bg-accent-crimson shadow-[0_0_10px_rgba(255,59,48,0.4)]'
                    : point.intensity > 0.7 ? 'bg-accent-crimson/60' : 'bg-accent-blue/40'
                } group-hover:bg-accent-gold`}
              />
              <span className="text-[7px] font-mono text-muted-foreground/60 -rotate-45 origin-left mt-2">
                {point.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-crimson animate-ping" />
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            Peak Activity Detected: <span className="text-foreground font-bold">02:00 - 05:00</span> (Ambush Windows)
          </p>
        </div>
      </div>

      {/* Monthly Distribution (Time of Year) */}
      <div className="glass-card p-8 border-border-glass bg-bg-glass space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-accent-blue">
            <Calendar className="w-4 h-4" /> Seasonal Escalation Matrix
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">FY 2025/26 Reporting</span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {monthlyData.map((month, i) => (
            <div key={i} className="space-y-2">
              <div className={`aspect-square rounded-lg border flex items-center justify-center relative group transition-all ${
                month.intensity > 0.8 ? 'bg-accent-crimson/20 border-accent-crimson/40' :
                month.intensity > 0.4 ? 'bg-accent-blue/10 border-accent-blue/20' :
                'bg-white/5 border-white/10'
              }`}>
                <span className={`text-[10px] font-black ${month.intensity > 0.8 ? 'text-accent-crimson' : 'text-muted-foreground/60'}`}>
                  {month.count}
                </span>
                <div className="absolute inset-0 bg-accent-gold opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
              </div>
              <p className="text-[8px] font-bold text-center text-muted-foreground/40 uppercase tracking-tighter">
                {month.label}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <ShieldAlert className="w-3.5 h-3.5 text-accent-gold" />
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            Predicted Seasonal Spike: <span className="text-accent-gold font-bold">Dec - Jan</span> (Festive Season Operations)
          </p>
        </div>
      </div>
    </div>
  );
}
