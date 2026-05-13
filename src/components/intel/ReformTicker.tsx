'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Gavel, 
  Users, 
  Scale, 
  FileCheck,
  Zap,
  ArrowRight,
  Target,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getReformData } from './actions';

export const ReformTicker = () => {
  const [reforms, setReforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReformData();
        setReforms(data);
      } catch (error) {
        console.error("Failed to fetch reform data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (pillar: string) => {
    const p = (pillar || "").toLowerCase();
    if (p.includes('whistle')) return Gavel;
    if (p.includes('architect') || p.includes('institution')) return ShieldCheck;
    if (p.includes('transparency')) return Users;
    if (p.includes('procurement')) return FileCheck;
    if (p.includes('accountability')) return Scale;
    return Zap;
  };

  const getColor = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === 'STALLED') return 'border-white/10 text-white/20';
    if (s === 'DEBATED' || s === 'CRITICAL') return 'border-accent-crimson/50 text-accent-crimson';
    if (s === 'PILOTING' || s === 'INGESTED') return 'border-green-500/50 text-green-400';
    return 'border-accent-blue/50 text-accent-blue';
  };

  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md min-h-[400px]">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-blue" />
            National Reform Ticker
          </h3>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Live Legislative Progress Tracking v3.0</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em]">Source: Live Intelligence Feed</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Synchronizing Reform Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reforms.length > 0 ? reforms.map((reform, i) => {
            const Icon = getIcon(reform.pillar);
            return (
              <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg bg-black/40 ${reform.pillar?.toLowerCase().includes('whistle') ? 'text-accent-gold' : 'text-accent-blue'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{reform.pillar}</span>
                      <h4 className="text-sm font-bold text-white/90 leading-tight pr-4 line-clamp-2">{reform.reform}</h4>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${getColor(reform.status)}`}>
                    {reform.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-white/30 italic truncate max-w-[150px]">Source: {reform.source}</span>
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
                  <span className="italic">Date: {reform.date ? new Date(reform.date).toLocaleDateString() : 'Active'}</span>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center opacity-50">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-xs font-mono uppercase">No active reform data found</p>
            </div>
          )}
        </div>
      )}

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
