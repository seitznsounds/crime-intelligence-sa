
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Building2, 
  AlertTriangle, 
  Network, 
  Users, 
  Search,
  Lock,
  Unlock,
  Package,
  TrendingDown,
  BarChart3
} from 'lucide-react';

const SAPS_NODES = [
  { name: "Crime Intelligence", risk: 92, status: "COMPROMISED", detail: "Feroz Khan (Arrested). Grabber weaponization." },
  { name: "DPCI (Hawks) Gauteng", risk: 85, status: "INFILTRATED", detail: "Ebrahim Kadwa (Arrested). Gold smuggling nexus." },
  { name: "Supply Chain Mgt", risk: 78, status: "HIGH RISK", detail: "R360m Medicare 24 tender fraud." },
  { name: "Organised Crime", risk: 72, status: "VULNERABLE", detail: "Richard Shibiri under investigation." },
  { name: "National Commissioner", risk: 88, status: "SUSPENDED", detail: "Fannie Masemola. Masemola trial pending." }
];

const CARTEL_LINKS = [
  { source: "Big Five Cartel", target: "SAPS Crime Intel", type: "Financing", strength: 95 },
  { source: "Point Blank Security", target: "DPCI Hawks", type: "Gold Smuggling", strength: 88 },
  { source: "Medicare 24", target: "SAPS SCM", type: "Tender Fraud", strength: 75 },
  { source: "Cat Matlala", target: "Political Killings TT", type: "Infiltration", strength: 82 }
];

export default function SapsInfiltrationHub() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-[1px] bg-accent-crimson/30" />
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-crimson">Institutional Infiltration Audit: SAPS/Cartel Nexus</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Institutional Risk Scoreboard */}
        <div className="lg:col-span-1 space-y-4">
          {SAPS_NODES.map((node, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{node.name}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                  node.status === "COMPROMISED" ? "border-accent-crimson text-accent-crimson bg-accent-crimson/10" :
                  node.status === "INFILTRATED" ? "border-accent-gold text-accent-gold bg-accent-gold/10" :
                  "border-slate-500 text-slate-400 bg-white/5"
                }`}>
                  {node.status}
                </span>
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-2xl font-bold tracking-tighter text-foreground">{node.risk}%</span>
                <span className="text-[9px] text-muted-foreground mb-1">Infiltration Risk Score</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${node.risk}%` }}
                  className={`h-full ${node.risk > 80 ? "bg-accent-crimson" : "bg-accent-gold"}`}
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-tight group-hover:text-foreground/80 transition-colors">
                {node.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Network Infiltration Visualization (SVG-lite) */}
        <div className="lg:col-span-2 glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-0 p-8 opacity-5">
            <Network className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2 mb-10">
              <h3 className="text-2xl font-bold tracking-tighter uppercase">The "Big Five" Cartel Grip</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">Mapping illicit flows and patronage links between syndicate financiers and state security leadership.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CARTEL_LINKS.map((link, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-accent-crimson" />
                      <span className="text-[10px] font-bold text-foreground/80 uppercase">{link.source}</span>
                    </div>
                    <div className="h-[1px] w-8 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-accent-blue" />
                      <span className="text-[10px] font-bold text-foreground/80 uppercase">{link.target}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-muted-foreground">Type: <span className="text-accent-gold uppercase">{link.type}</span></span>
                    <span className="text-accent-crimson font-bold">Strength: {link.strength}%</span>
                  </div>
                  <div className="absolute -bottom-1 left-0 h-[2px] bg-accent-crimson group-hover:w-full transition-all duration-700" style={{ width: '0%' }} />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl border border-accent-crimson/20 bg-accent-crimson/[0.03] flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-accent-crimson shrink-0" />
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-accent-crimson">Operational Failure: Aeroton Cocaine Heist</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  The theft of 136kg of high-grade cocaine from a "secure" forensic lab in Aeroton (July 2021) is directly linked to the Khan-Kadwa nexus. 
                  Intelligence suggests the "Dirty Dozen" SCM faction facilitated the breach by disabling surveillance protocols.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3 h-3 text-accent-gold" />
                    <span className="text-[9px] font-mono text-white/50">Loss: R55m (Cocaine)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-accent-blue" />
                    <span className="text-[9px] font-mono text-white/50">Status: EVIDENCE TAMPERED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
