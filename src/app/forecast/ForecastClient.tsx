"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Activity, Target, ShieldAlert, Zap, ChevronRight, AlertTriangle, Network, TrendingUp, Users, Megaphone } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";

interface ForecastCard {
  id: string;
  title: string;
  risk: number;
  trend: string;
  nodes: number;
  status: string;
  tags: string[];
  sparkline: number[];
  desc: string;
}

export default function ForecastPage({ initialCards }: { initialCards: ForecastCard[] }) {
  const [cards, setCards] = useState<ForecastCard[]>(initialCards);
  return (
    <PageShell
      title="Corruption Predictions"
      subtitle="Our AI analyses patterns in corruption data to predict where new corruption networks are likely to emerge."
      badge="Predictions"
      badgeColor="gold"
      icon={<Brain className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investigate", href: "/expose" }, { label: "AI Forecast", href: "/forecast" }]}
      guidance="This page shows areas and organisations that our system predicts are at high risk of becoming corruption hotspots, based on patterns in financial flows, political connections, and historical data. A higher percentage means a stronger prediction."
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Active Predictions", value: "32", icon: <Target className="w-4 h-4 text-accent-blue" /> },
          { label: "AI Confidence", value: "94.8%", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
          { label: "Data Points Analysed", value: "1.2M", icon: <Network className="w-4 h-4 text-muted-foreground/60" /> },
          { label: "Warning Signals", value: "814", icon: <Zap className="w-4 h-4 text-accent-crimson" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3"><span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>{item.icon}</div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Predicted Corruption Hotspots</h3>
            <button className="text-[11px] font-bold uppercase tracking-widest text-accent-gold hover:text-foreground transition-colors">Check for New Patterns</button>
          </div>

          {cards.map((card, i) => {
            const statusLabel = (s: string) => s === 'EMERGING_HUB' ? 'High Risk' : 'Being Watched';
            return (
            <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group relative overflow-hidden">
              {/* Probability gauge */}
              <div className="absolute top-0 right-0 w-1.5 h-full bg-border-glass">
                <motion.div className="w-full bg-accent-gold" initial={{ height: 0 }} animate={{ height: `${card.risk}%` }} transition={{ duration: 1.5, delay: 0.5 }} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-mono text-muted-foreground/60 tracking-widest">ID: {card.id}</span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold tracking-widest uppercase ${card.status === 'EMERGING_HUB' ? 'bg-accent-crimson/5 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-gold/5 border-accent-gold/20 text-accent-gold'}`}>{statusLabel(card.status)}</span>
                    {card.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-charcoal-3 border border-border-glass text-[9px] font-black tracking-widest text-muted-foreground uppercase">{tag.replace('_', ' ')}</span>
                    ))}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold tracking-tight uppercase mb-3 text-foreground">{card.title}</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-light mb-6 max-w-xl">{card.desc}</p>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-muted-foreground/60" />
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase">Growth Trend</p>
                        <p className={`text-[13px] font-mono font-bold ${card.trend.startsWith('+') ? 'text-accent-crimson' : 'text-accent-blue'}`}>{card.trend}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Network className="w-4 h-4 text-muted-foreground/60" />
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase">Connected People/Orgs</p>
                        <p className="text-[13px] font-mono font-bold text-foreground">{card.nodes} linked</p>
                      </div>
                    </div>
                    {/* Sparkline */}
                    <div className="hidden sm:block pl-6 border-l border-border-glass">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Activity Trend</p>
                      <svg width="80" height="24" className="overflow-visible">
                        <motion.path
                          d={`M ${card.sparkline.map((val, idx) => `${(idx / (card.sparkline.length - 1)) * 80} ${24 - (val / Math.max(...card.sparkline)) * 24}`).join(' L ')}`}
                          fill="none"
                          stroke={card.risk > 80 ? 'var(--accent-crimson)' : 'var(--accent-blue)'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: i * 0.2 }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3 shrink-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Risk Level</p>
                  <p className="text-5xl font-bold tracking-tighter text-foreground">{card.risk}%</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:text-background hover:border-accent-gold transition-all">View Full Analysis <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Activity className="w-4 h-4" /> Recent Warning Signals</h3>
            <div className="space-y-4">
              {[{ node: "Case #882", type: "Unusual Connections", conf: "92%" }, { node: "Case #401", type: "Missing Case Files", conf: "88%" }, { node: "Case #219", type: "Money Moving Abroad", conf: "74%" }, { node: "Case #771", type: "Near a Politician", conf: "91%" }].map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-border-glass">
                  <div>
                    <p className="text-[12px] font-mono text-foreground/80">{log.node}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{log.type}</p>
                  </div>
                  <span className="text-[12px] font-mono text-accent-gold font-bold">{log.conf}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border-glass text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">View All Predictions</button>
          </div>
          <div className="glass-card p-6 border-accent-gold/20 bg-accent-gold/[0.02]">
            <div className="flex items-center gap-3 mb-4"><ShieldAlert className="w-4 h-4 text-accent-gold" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-gold">How This Works</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-6">"Our AI scans thousands of financial records, political connections, and crime reports to spot emerging patterns before corruption networks can establish themselves."</p>
            <div className="p-4 bg-bg-glass border border-border-glass rounded-xl">
              <div className="flex justify-between text-[11px] font-mono mb-2"><span className="text-muted-foreground">System Uptime</span><span className="text-accent-blue">99.8%</span></div>
              <div className="h-1 bg-bg-glass-heavy rounded-full overflow-hidden"><div className="h-full bg-accent-blue w-[99.8%]" /></div>
            </div>
          </div>
        </div>
      </div>

      <WhatNext suggestions={[
        { title: "Corruption Connections", description: "See the network map showing how these predicted hotspots connect to known corrupt officials.", href: "/network", icon: Network },
        { title: "Crime Syndicates", description: "Explore the structure of major crime networks already operating in South Africa.", href: "/syndicates", icon: Users },
        { title: "Report What You Know", description: "If you have information about corruption, you can report it anonymously.", href: "/report", icon: Megaphone },
      ]} />
    </PageShell>
  );
}
