"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  Fingerprint, 
  Zap,
  ChevronRight,
  AlertTriangle,
  Network
} from "lucide-react";

const FORECAST_CARDS = [
  { 
    id: "FC_882", 
    title: "Regional Procurement Syndicate", 
    risk: 92, 
    trend: "+14.2%", 
    nodes: 24, 
    status: "EMERGING_HUB",
    desc: "AI detected anomalous linkage density between 3 municipal officials and a verified logistics syndicate in Gauteng."
  },
  { 
    id: "FC_401", 
    title: "SAPS Evidence Tampering Cluster", 
    risk: 85, 
    trend: "+8.9%", 
    nodes: 12, 
    status: "ACTIVE_ANOMALY",
    desc: "Sequential docket disappearance patterns identified across 4 neighboring stations in the eThekwini district."
  },
  { 
    id: "FC_219", 
    title: "Cross-Border Financial Loop", 
    risk: 78, 
    trend: "-2.4%", 
    nodes: 42, 
    status: "STABILIZING",
    desc: "Large-scale financial transfers identified to offshore entities linked to PEP Tier 2 facilitators."
  }
];

export default function ForecastPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-accent-crimson/30">
      {/* Background Brain Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ff3b3005,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container py-20 relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-2xl flex items-center justify-center border border-accent-gold/20">
              <Brain className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-gold/5 border border-accent-gold/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-gold">Predictive Analysis Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">AI Corruption Forecasting</h1>
            </div>
          </div>
        </header>

        {/* Global Forecast HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Active Forecasts", value: "32", icon: <Target className="w-4 h-4 text-accent-blue" /> },
            { label: "AI Confidence", value: "94.8%", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
            { label: "Linkages Processed", value: "1.2M", icon: <Network className="w-4 h-4 text-white/20" /> },
            { label: "Anomaly Triggers", value: "814", icon: <Zap className="w-4 h-4 text-accent-crimson" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Emerging Threats List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">Emerging Corruption Hubs</h3>
              <button className="text-[9px] font-bold uppercase tracking-widest text-accent-gold hover:text-white transition-colors">
                Run Link Analysis Sweep
              </button>
            </div>

            {FORECAST_CARDS.map((card, i) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden"
              >
                {/* Forecast Probability Gauge */}
                <div className="absolute top-0 right-0 w-2 h-full bg-white/[0.02]">
                  <motion.div 
                    className="w-full bg-accent-gold" 
                    initial={{ height: 0 }}
                    animate={{ height: `${card.risk}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-mono text-accent-gold/40 tracking-widest">ID: {card.id}</span>
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-bold tracking-widest uppercase ${card.status === 'EMERGING_HUB' ? 'bg-accent-crimson/5 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-gold/5 border-accent-gold/20 text-accent-gold'}`}>
                        {card.status}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight uppercase mb-4">{card.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-light mb-8 max-w-xl">{card.desc}</p>
                    
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-white/20" />
                        <div>
                          <p className="text-[9px] font-bold text-white/20 uppercase">Growth Trend</p>
                          <p className={`text-xs font-mono font-bold ${card.trend.startsWith('+') ? 'text-accent-crimson' : 'text-accent-blue'}`}>{card.trend}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Network className="w-4 h-4 text-white/20" />
                        <div>
                          <p className="text-[9px] font-bold text-white/20 uppercase">Active Nodes</p>
                          <p className="text-xs font-mono font-bold text-white/80">{card.nodes} ENTITIES</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-right flex flex-col items-center md:items-end">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-2">Hub Probability</p>
                    <p className="text-5xl font-bold tracking-tighter text-white mb-6">{card.risk}%</p>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:text-black transition-all">
                      Deep Link Audit <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Forecast Controls & Logs */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <Activity className="w-4 h-4" /> Live Anomaly Feed
              </h3>
              <div className="space-y-6">
                {[
                  { node: "#NODE_882", type: "LINK_SPIKE", conf: "92%" },
                  { node: "#NODE_401", type: "DOCKET_ANOMALY", conf: "88%" },
                  { node: "#NODE_219", type: "CAPITAL_FLIGHT", conf: "74%" },
                  { node: "#NODE_771", type: "PEP_PROXIMITY", conf: "91%" }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                    <div>
                      <p className="text-[9px] font-mono text-white/80">{log.node}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">{log.type}</p>
                    </div>
                    <span className="text-[10px] font-mono text-accent-gold font-bold">{log.conf}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all">
                Access Forecasting Archives
              </button>
            </div>

            <div className="glass-card p-8 border-accent-gold/20 bg-accent-gold/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-4 h-4 text-accent-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Integrity Audit</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed font-light italic mb-8">
                "AI Forecasting is a proactive defensive layer. We use Link Analysis to flag systemic decay before it matures into legal precedent."
              </p>
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                <div className="flex justify-between text-[9px] font-mono mb-2">
                  <span className="text-white/20">SYSTEM_RELIABILITY</span>
                  <span className="text-accent-blue">99.8%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-blue w-[99.8%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
