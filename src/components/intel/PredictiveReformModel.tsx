'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Activity,
  History,
  ShieldAlert,
  Network,
  ChevronRight,
  BrainCircuit,
  Link2
} from 'lucide-react';
import { getInferredLinks } from './actions';

const REFORM_NODES = [
  { name: "OPI Constitutional Amendment", baseDays: 730, elapsed: 245, difficulty: 0.95, momentum: 0.15 },
  { name: "Protected Disclosures Bill (2026)", baseDays: 365, elapsed: 182, difficulty: 0.6, momentum: 0.45 },
  { name: "SIU-to-OPI Operational Transfer", baseDays: 540, elapsed: 310, difficulty: 0.4, momentum: 0.65 }
];

export const PredictiveReformModel = () => {
  const [activeTab, setActiveTab] = useState<'reform' | 'infiltration'>('infiltration');
  const [inferredHubs, setInferredHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInferredLinks();
        setInferredHubs(data);
      } catch (err) {
        console.error("Failed to load inference data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const reformPredictions = useMemo(() => {
    return REFORM_NODES.map(node => {
      const remainingDays = Math.max(30, Math.round(((node.baseDays - node.elapsed) * node.difficulty) / (node.momentum || 0.1)));
      const probability = Math.round((node.momentum * (1 - node.difficulty / 2)) * 100);
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + remainingDays);
      return {
        ...node,
        remainingDays,
        probability,
        completionDate: completionDate.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
      };
    });
  }, []);

  return (
    <div className="glass-card border border-white/10 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent-blue">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Predictive Intel Engine</h3>
            </div>
            <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest leading-tight">Semantic Graph Inference v1.0.4-live</p>
          </div>
          <div className="px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/10 flex items-center gap-2">
            <Activity className="w-3 h-3 text-accent-blue animate-pulse" />
            <span className="text-[9px] font-bold text-accent-blue uppercase tracking-tighter">AI Inference Active</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('infiltration')}
            className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'infiltration' 
                ? 'bg-accent-crimson border-accent-crimson text-white shadow-glow-crimson-sm' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            Predictive Linkage
          </button>
          <button 
            onClick={() => setActiveTab('reform')}
            className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'reform' 
                ? 'bg-accent-blue border-accent-blue text-white shadow-glow-blue-sm' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            Reform Trajectory
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'infiltration' ? (
          <div className="space-y-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <BrainCircuit className="w-8 h-8 text-accent-crimson animate-pulse" />
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Running pgvector Graph Inference...</p>
                </div>
            ) : inferredHubs.length > 0 ? (
                inferredHubs.map((hub, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <ShieldAlert className="w-4 h-4 text-accent-crimson" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">{hub.hubName} Hub</h4>
                        </div>
                        <div className="space-y-3 ml-2">
                            {hub.predictions.map((pred: any, j: number) => (
                                <div key={j} className="p-3 bg-white/[0.03] border border-white/5 rounded-lg group hover:border-accent-crimson/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded bg-accent-crimson/20 border border-accent-crimson/30">
                                                <Link2 className="w-3 h-3 text-accent-crimson" />
                                            </div>
                                            <span className="text-[11px] font-bold text-white uppercase tracking-tighter">{pred.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-accent-crimson font-mono">{Math.round(pred.score)}%</span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-white/40 leading-tight italic">"{pred.reason}"</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white/60 uppercase tracking-widest">
                                            {pred.type} SOURCE
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-[10px] text-white/20 uppercase font-bold">No High-Probability Hubs Identified</p>
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reformPredictions.map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-bold text-white/90 uppercase tracking-tighter">{p.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-white/30 uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>Est. {p.completionDate}</span>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                        p.probability > 60 ? 'bg-green-500/20 text-green-400' : 'bg-accent-gold/20 text-accent-gold'
                      }`}>
                        {p.probability}% Confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-white tracking-tighter">{p.remainingDays}d</div>
                    <div className="text-[7px] text-white/20 uppercase font-bold text-nowrap">Days Rem.</div>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      p.probability > 60 ? 'bg-green-500' : 'bg-accent-gold'
                    }`}
                    style={{ width: `${(p.elapsed / p.baseDays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10 flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
          <History className="w-4 h-4 text-white/40" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Model Variance Weighting</p>
          <p className="text-[10px] text-white/60 italic leading-tight">
            "Proximity weighted by Big Five relationship graph and SCM tender anomaly history."
          </p>
        </div>
      </div>
    </div>
  );
};
