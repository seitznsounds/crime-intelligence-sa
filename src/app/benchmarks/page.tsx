"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, Scale, Activity, ShieldAlert, ChevronRight, BarChart3, TrendingDown, TrendingUp, Target, Zap } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const BENCHMARKS = [
  { id: "BM_01", name: "Corruption Perceptions Index (CPI)", category: "corruption", rank: 72, total: 180, score: 41.0, trend: "down", peers: [{ name: "Botswana", score: 60.0 }, { name: "Brazil", score: 38.0 }, { name: "India", score: 40.0 }], desc: "Measures perceived levels of public sector corruption. South Africa remains in a stagnation zone, failing to break into the upper tier of transparent nations." },
  { id: "BM_02", name: "Global Organized Crime Index", category: "crime", rank: 7, total: 193, score: 7.18, trend: "up", peers: [{ name: "Nigeria", score: 7.15 }, { name: "Mexico", score: 7.57 }, { name: "Italy", score: 6.30 }], desc: "A high score indicates high criminality and low resilience. SA's high ranking reflects deeply entrenched criminal syndicates." },
  { id: "BM_03", name: "Rule of Law Index", category: "rule_of_law", rank: 56, total: 142, score: 0.58, trend: "stable", peers: [{ name: "Namibia", score: 0.62 }, { name: "Rwanda", score: 0.61 }, { name: "Zambia", score: 0.45 }], desc: "SA performs well in open government but poorly in criminal justice efficiency." }
];

type Benchmark = typeof BENCHMARKS[0];

export default function BenchmarksPage() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark | null>(null);

  return (
    <PageShell
      title="Global Benchmarks"
      subtitle="Benchmarking South African investigative data against international corruption standards to generate evidence for global pressure campaigns."
      badge="Phase 5: Global Transparency Index"
      badgeColor="blue"
      icon={<Globe className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Data", href: "/stats" }, { label: "Global Benchmarks", href: "/benchmarks" }]}
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Global Rank (Avg)", value: "45th", icon: <Target className="w-4 h-4 text-muted-foreground/60" /> },
          { label: "Transparency Deficit", value: "28.4%", icon: <TrendingDown className="w-4 h-4 text-accent-crimson" /> },
          { label: "Reform Priority", value: "CRITICAL", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
          { label: "Pressure Index", value: "8.2/10", icon: <Zap className="w-4 h-4 text-accent-blue" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3"><span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>{item.icon}</div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><BarChart3 className="w-4 h-4 text-accent-blue" /> International Indices</h3>
          {BENCHMARKS.map((index, i) => (
            <motion.div key={index.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedBenchmark(index)}
              className={`glass-card p-6 sm:p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy cursor-pointer transition-all relative overflow-hidden group ${selectedBenchmark?.id === index.id ? 'border-accent-blue/40 bg-accent-blue/[0.02]' : ''}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase">CAT: {index.category}</span>
                    {index.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-accent-crimson" /> : index.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-accent-blue" /> : null}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold tracking-tighter uppercase text-foreground">{index.name}</h4>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right border-r border-border-glass pr-6">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rank</p>
                    <p className="text-2xl font-bold font-mono tracking-tighter text-foreground">{index.rank}<span className="text-[13px] text-muted-foreground ml-1">/{index.total}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Score</p>
                    <p className="text-3xl font-bold font-mono tracking-tighter text-accent-blue">{index.score}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic">"{index.desc}"</p>
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Regional Peer Comparison</p>
                  {index.peers.map((peer, pi) => (
                    <div key={pi} className="flex justify-between items-center text-[11px] font-mono gap-3">
                      <span className="text-muted-foreground w-20 truncate">{peer.name}</span>
                      <div className="flex-1 h-1 bg-bg-glass-heavy rounded-full overflow-hidden"><div className="h-full bg-accent-blue/40" style={{ width: `${(peer.score / 100) * 100}%` }} /></div>
                      <span className="text-foreground/80 w-8 text-right">{peer.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border-glass pt-5">
                <span className="flex items-center gap-2"><Scale className="w-3 h-3 text-accent-blue" /> Methodology: International Standard V1.2</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Transparency Radar */}
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Activity className="w-4 h-4 text-accent-blue" /> Transparency Radar</h3>
            <div className="aspect-square relative flex items-center justify-center p-6">
              <div className="absolute inset-6 flex items-center justify-center">
                {[100, 75, 50, 25].map(size => <div key={size} className="absolute border border-border-glass rounded-full" style={{ width: `${size}%`, height: `${size}%` }} />)}
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-px h-full bg-border-glass" /><div className="w-full h-px bg-border-glass" /></div>
              </div>
              <motion.div className="w-24 h-24 bg-accent-blue/10 border-2 border-accent-blue rounded-full flex items-center justify-center relative z-10" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                <span className="text-[11px] font-mono font-bold text-accent-blue">SA_CORE</span>
              </motion.div>
              {[{ pos: "top-4 left-1/2 -translate-x-1/2", label: "RULE_OF_LAW" }, { pos: "bottom-4 left-1/2 -translate-x-1/2", label: "TRANSPARENCY" }, { pos: "left-4 top-1/2 -translate-y-1/2 rotate-90", label: "RESILIENCE" }, { pos: "right-4 top-1/2 -translate-y-1/2 -rotate-90", label: "GOVERNANCE" }].map(({ pos, label }) => (
                <div key={label} className={`absolute text-[10px] font-bold text-muted-foreground/60 ${pos}`}>{label}</div>
              ))}
            </div>
            <p className="text-[11px] text-center text-muted-foreground font-mono uppercase tracking-widest mt-2">Deviation Target: -12.4%</p>
          </div>

          <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/[0.01]">
            <div className="flex items-center gap-3 mb-4"><Scale className="w-4 h-4 text-accent-blue" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-blue">Global Pressure Protocol</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-5">"By benchmarking SA data against global standards, we provide the international community with the evidentiary basis required to exert pressure for systemic reform."</p>
            <button className="w-full py-3 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all">Submit Data to TI Global</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
