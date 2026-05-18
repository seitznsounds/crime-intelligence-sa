"use client";

import { motion } from "framer-motion";
import { Scale, Globe, Map as MapIcon, BarChart3, Info } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

interface HeatmapData {
    name: string;
    value: number;
}

export default function LegalHeatmapClient({ data }: { data: HeatmapData[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <PageShell
      title="Judicial Intelligence Heatmap"
      subtitle="Geospatial distribution of high court criminal judgments across South Africa's legal divisions."
      badge="Legal Forensics"
      badgeColor="blue"
      icon={<Globe className="w-6 h-6 text-accent-blue" />}
    >
      <div className="space-y-12">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Visual Heatmap Bars */}
            <div className="lg:col-span-2 glass-card p-10 border-border-glass bg-bg-glass relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <MapIcon className="w-20 h-20 text-accent-blue" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-10 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent-blue" /> Judgment Density by Division
                </h3>

                <div className="space-y-6">
                    {data.map((item, i) => (
                        <motion.div 
                            key={item.name}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ delay: i * 0.05, duration: 0.8 }}
                            className="group"
                        >
                            <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-accent-blue transition-colors">{item.name}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">{item.value} Rulings</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-accent-blue/40 to-accent-blue shadow-glow-blue"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sidebar Context */}
            <div className="space-y-6">
                <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-4 h-4 text-accent-blue" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Forensic Distribution</h4>
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground mb-6 font-medium">
                        This heatmap represents the volume of criminal jurisprudence indexed from Sabinet Discover. 
                        Higher densities in Gauteng and KZN reflect the centralization of organized crime litigation.
                    </p>
                    <div className="p-4 bg-accent-blue/5 border border-accent-blue/10 rounded-xl">
                        <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest block mb-1">Total Intelligence Pool</span>
                        <span className="text-2xl font-black text-foreground">{data.reduce((acc, curr) => acc + curr.value, 0)} Rulings</span>
                    </div>
                </div>

                <div className="glass-card p-8 border-accent-crimson/20 bg-accent-crimson/[0.02]">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-accent-crimson mb-4">Corruption Hotspots</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tighter">
                        Divisions with high case volumes are prioritized for automated director and beneficial ownership research.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </PageShell>
  );
}
