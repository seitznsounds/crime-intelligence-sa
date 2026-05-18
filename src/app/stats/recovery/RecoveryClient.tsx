"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, DollarSign, ArrowUpRight, BarChart3, PieChart, Activity } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

export default function AssetRecoveryDashboard() {
  // Mock data for the aesthetic prototype
  const recoveries = [
    { title: "Zidani Syndicate Forfeiture", value: 12500000, date: "2026-05-12", status: "RECOVERED" },
    { title: "CIT Heist Cash Recovery (N2)", value: 4200000, date: "2026-04-30", status: "SEIZED" },
    { title: "Illegal Mining Equipment Seizure", value: 850000, date: "2026-05-01", status: "RECOVERED" },
    { title: "Tender Fraud Asset Freeze", value: 45000000, date: "2026-03-15", status: "FROZEN" },
    { title: "Police Bribery Asset Forfeiture", value: 120000, date: "2026-05-10", status: "RECOVERED" }
  ];

  const totalValue = recoveries.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <PageShell
      title="Asset Recovery Tracker"
      subtitle="Monitoring the return of stolen state funds and seized criminal enterprise assets."
      badge="Financial Forensics"
      badgeColor="gold"
      icon={<DollarSign className="w-6 h-6 text-accent-gold" />}
    >
      <div className="space-y-12">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Total Value Identified</span>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-foreground">R{(totalValue / 1000000).toFixed(1)}M</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
            </div>
            
            <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Successfully Recovered</span>
                <h3 className="text-4xl font-black text-foreground">R17.5M</h3>
            </div>

            <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-crimson" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Pending Forfeiture</span>
                <h3 className="text-4xl font-black text-foreground">R45.0M</h3>
            </div>
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-10 border-border-glass bg-bg-glass min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-accent-gold" /> Recovery Trajectory
                    </h4>
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">CY 2026 (PROJECTED)</span>
                </div>
                <div className="flex-1 border-b border-l border-border-glass relative">
                    {/* Simulated Visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-accent-gold/10 to-transparent" />
                    <div className="absolute bottom-[20%] left-[10%] w-[10%] h-[20%] bg-accent-gold/20 border-t-2 border-accent-gold" />
                    <div className="absolute bottom-[40%] left-[30%] w-[10%] h-[40%] bg-accent-gold/20 border-t-2 border-accent-gold" />
                    <div className="absolute bottom-[50%] left-[50%] w-[10%] h-[50%] bg-accent-gold/40 border-t-2 border-accent-gold" />
                    <div className="absolute bottom-[70%] left-[70%] w-[10%] h-[70%] bg-accent-gold/60 border-t-2 border-accent-gold shadow-glow-gold" />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-4">
                    <Activity className="w-4 h-4 text-accent-gold" /> Recent Seizure Feed
                </h4>
                <div className="space-y-3">
                    {recoveries.map((rec, i) => (
                        <div key={i} className="p-6 bg-bg-glass-heavy border border-border-glass rounded-2xl flex items-center justify-between group hover:border-accent-gold/30 transition-all">
                            <div className="space-y-1">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                    rec.status === 'RECOVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                                    rec.status === 'FROZEN' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' :
                                    'bg-accent-gold/10 border-accent-gold/20 text-accent-gold'
                                }`}>
                                    {rec.status}
                                </span>
                                <h5 className="text-[13px] font-bold uppercase tracking-tight">{rec.title}</h5>
                                <p className="text-[10px] text-muted-foreground font-mono">{rec.date}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-foreground uppercase tracking-tighter">R{rec.value.toLocaleString()}</span>
                                <ArrowUpRight className="w-4 h-4 text-accent-gold ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </PageShell>
  );
}
