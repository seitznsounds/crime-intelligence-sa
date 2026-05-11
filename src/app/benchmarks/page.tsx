"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Globe, 
  Scale, 
  Activity, 
  ShieldAlert, 
  ChevronRight, 
  BarChart3, 
  TrendingDown,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";

const BENCHMARKS = [
  { 
    id: "BM_01", 
    name: "Corruption Perceptions Index (CPI)", 
    category: "corruption", 
    rank: 72, 
    total: 180, 
    score: 41.0, 
    trend: "down",
    peers: [
      { name: "Botswana", score: 60.0 },
      { name: "Brazil", score: 38.0 },
      { name: "India", score: 40.0 }
    ],
    desc: "Measures the perceived levels of public sector corruption. South Africa remains in a stagnation zone, failing to break into the upper tier of transparent nations."
  },
  { 
    id: "BM_02", 
    name: "Global Organized Crime Index", 
    category: "crime", 
    rank: 7, 
    total: 193, 
    score: 7.18, 
    trend: "up",
    peers: [
      { name: "Nigeria", score: 7.15 },
      { name: "Mexico", score: 7.57 },
      { name: "Italy", score: 6.30 }
    ],
    desc: "A high score indicates high levels of criminality and low levels of resilience. South Africa's high ranking reflects deeply entrenched criminal syndicates."
  },
  { 
    id: "BM_03", 
    name: "Rule of Law Index", 
    category: "rule_of_law", 
    rank: 56, 
    total: 142, 
    score: 0.58, 
    trend: "stable",
    peers: [
      { name: "Namibia", score: 0.62 },
      { name: "Rwanda", score: 0.61 },
      { name: "Zambia", score: 0.45 }
    ],
    desc: "Evaluates the degree to which countries adhere to the rule of law in practice. SA performs well in open government but poorly in criminal justice efficiency."
  }
];

export default function BenchmarksPage() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<any>(null);

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-accent-blue/30">
      {/* Global Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#007aff03,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center border border-accent-blue/20 shadow-glow-blue">
              <Globe className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-blue/5 border border-accent-blue/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-blue font-mono">Phase 5: Global Transparency Index</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Global Benchmarks</h1>
            </div>
          </div>
        </header>

        {/* Global HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Global Rank (Avg)", value: "45th", icon: <Target className="w-4 h-4 text-white/20" /> },
            { label: "Transparency Deficit", value: "28.4%", icon: <TrendingDown className="w-4 h-4 text-accent-crimson" /> },
            { label: "Reform Priority", value: "CRITICAL", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
            { label: "Pressure Index", value: "8.2/10", icon: <Zap className="w-4 h-4 text-accent-blue" /> }
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
          {/* Main Index Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-accent-blue" /> International Indices
            </h3>
            
            <div className="space-y-6">
              {BENCHMARKS.map((index, i) => (
                <motion.div 
                  key={index.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedBenchmark(index)}
                  className={`glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all relative overflow-hidden group ${selectedBenchmark?.id === index.id ? 'border-accent-blue/40 bg-accent-blue/[0.02]' : ''}`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">CAT: {index.category}</span>
                        {index.trend === 'up' ? <TrendingUp className="w-3 h-3 text-accent-crimson" /> : <TrendingDown className="w-3 h-3 text-accent-blue" />}
                      </div>
                      <h4 className="text-2xl font-bold tracking-tighter uppercase">{index.name}</h4>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                       <div className="text-right border-r border-white/5 pr-8">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Rank</p>
                          <p className="text-2xl font-bold font-mono tracking-tighter">{index.rank}<span className="text-xs text-white/20 ml-1">/{index.total}</span></p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Score</p>
                          <p className="text-4xl font-bold font-mono tracking-tighter text-accent-blue">{index.score}</p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs text-white/40 leading-relaxed font-light line-clamp-3 italic">
                        "{index.desc}"
                      </p>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Regional Peer Comparison</p>
                       <div className="space-y-2">
                          {index.peers.map((peer, pi) => (
                            <div key={pi} className="flex justify-between items-center text-[10px] font-mono">
                               <span className="text-white/40">{peer.name}</span>
                               <div className="flex items-center gap-4 flex-1 mx-4">
                                  <div className="h-0.5 bg-white/5 flex-1 rounded-full overflow-hidden">
                                     <div className="h-full bg-accent-blue/40" style={{ width: `${(peer.score / 100) * 100}%` }} />
                                  </div>
                               </div>
                               <span className="text-white/80">{peer.score}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-widest border-t border-white/5 pt-6">
                    <span className="flex items-center gap-2">
                      <Scale className="w-3 h-3 text-accent-blue" /> Comparison Methodology: International Standard V1.2
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Transparency Gap Visualization */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <Activity className="w-4 h-4 text-accent-blue" /> Transparency Radar
              </h3>
              <div className="aspect-square relative flex items-center justify-center p-8">
                 {/* Simulated Radar Chart with Circles and CSS */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border border-white/5 rounded-full" />
                    <div className="absolute w-[75%] h-[75%] border border-white/5 rounded-full" />
                    <div className="absolute w-[50%] h-[50%] border border-white/5 rounded-full" />
                    <div className="absolute w-[25%] h-[25%] border border-white/5 rounded-full" />
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-full bg-white/5" />
                    <div className="w-full h-px bg-white/5" />
                 </div>
                 
                 {/* The "Gap" shape simulated with motion div */}
                 <motion.div 
                    className="w-32 h-32 bg-accent-blue/10 border-2 border-accent-blue rounded-full shadow-glow-blue flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                 >
                    <span className="text-[10px] font-mono font-bold text-accent-blue">SA_CORE</span>
                 </motion.div>
                 
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/20">RULE_OF_LAW</div>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/20">TRANSPARENCY</div>
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-bold text-white/20 rotate-90">RESILIENCE</div>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-bold text-white/20 -rotate-90">GOVERNANCE</div>
              </div>
              <p className="text-[10px] text-center text-white/20 font-mono uppercase tracking-widest mt-8">Deviation Target: -12.4%</p>
            </div>

            <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-4 h-4 text-accent-blue" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">Global Pressure protocol</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light italic mb-8">
                "By benchmarking South African investigative data against global standards, we provide the international community with the evidentiary basis required to exert pressure for systemic reform."
              </p>
              <button className="w-full py-4 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all">
                Submit Data to TI Global
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
