"use client";

import { motion } from "framer-motion";
import { Brain, Activity, Target, ShieldAlert, Zap, ChevronRight, AlertTriangle, Network } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const FORECAST_CARDS = [
  { id: "FC_882", title: "Regional Procurement Syndicate", risk: 92, trend: "+14.2%", nodes: 24, status: "EMERGING_HUB", desc: "AI detected anomalous linkage density between 3 municipal officials and a verified logistics syndicate in Gauteng." },
  { id: "FC_401", title: "SAPS Evidence Tampering Cluster", risk: 85, trend: "+8.9%", nodes: 12, status: "ACTIVE_ANOMALY", desc: "Sequential docket disappearance patterns identified across 4 neighboring stations in the eThekwini district." },
  { id: "FC_219", title: "Cross-Border Financial Loop", risk: 78, trend: "-2.4%", nodes: 42, status: "STABILIZING", desc: "Large-scale financial transfers identified to offshore entities linked to PEP Tier 2 facilitators." }
];

export default function ForecastPage() {
  return (
    <PageShell
      title="AI Corruption Forecasting"
      subtitle="Predictive link analysis detecting emerging corruption hubs before they solidify. 94.8% AI confidence across 1.2M processed linkages."
      badge="Predictive Analysis Sector"
      badgeColor="gold"
      icon={<Brain className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investigate", href: "/expose" }, { label: "AI Forecast", href: "/forecast" }]}
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Active Forecasts", value: "32", icon: <Target className="w-4 h-4 text-accent-blue" /> },
          { label: "AI Confidence", value: "94.8%", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
          { label: "Linkages Processed", value: "1.2M", icon: <Network className="w-4 h-4 text-muted-foreground/60" /> },
          { label: "Anomaly Triggers", value: "814", icon: <Zap className="w-4 h-4 text-accent-crimson" /> }
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
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Emerging Corruption Hubs</h3>
            <button className="text-[11px] font-bold uppercase tracking-widest text-accent-gold hover:text-foreground transition-colors">Run Link Analysis Sweep</button>
          </div>

          {FORECAST_CARDS.map((card, i) => (
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
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold tracking-widest uppercase ${card.status === 'EMERGING_HUB' ? 'bg-accent-crimson/5 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-gold/5 border-accent-gold/20 text-accent-gold'}`}>{card.status}</span>
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
                        <p className="text-[11px] font-bold text-muted-foreground uppercase">Active Nodes</p>
                        <p className="text-[13px] font-mono font-bold text-foreground">{card.nodes} ENTITIES</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3 shrink-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Hub Probability</p>
                  <p className="text-5xl font-bold tracking-tighter text-foreground">{card.risk}%</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:text-background hover:border-accent-gold transition-all">Deep Link Audit <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Activity className="w-4 h-4" /> Live Anomaly Feed</h3>
            <div className="space-y-4">
              {[{ node: "#NODE_882", type: "LINK_SPIKE", conf: "92%" }, { node: "#NODE_401", type: "DOCKET_ANOMALY", conf: "88%" }, { node: "#NODE_219", type: "CAPITAL_FLIGHT", conf: "74%" }, { node: "#NODE_771", type: "PEP_PROXIMITY", conf: "91%" }].map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-border-glass">
                  <div>
                    <p className="text-[12px] font-mono text-foreground/80">{log.node}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{log.type}</p>
                  </div>
                  <span className="text-[12px] font-mono text-accent-gold font-bold">{log.conf}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border-glass text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Access Forecasting Archives</button>
          </div>
          <div className="glass-card p-6 border-accent-gold/20 bg-accent-gold/[0.02]">
            <div className="flex items-center gap-3 mb-4"><ShieldAlert className="w-4 h-4 text-accent-gold" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-gold">Integrity Audit</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-6">"AI Forecasting is a proactive defensive layer. We use Link Analysis to flag systemic decay before it matures into legal precedent."</p>
            <div className="p-4 bg-bg-glass border border-border-glass rounded-xl">
              <div className="flex justify-between text-[11px] font-mono mb-2"><span className="text-muted-foreground">SYSTEM_RELIABILITY</span><span className="text-accent-blue">99.8%</span></div>
              <div className="h-1 bg-bg-glass-heavy rounded-full overflow-hidden"><div className="h-full bg-accent-blue w-[99.8%]" /></div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
