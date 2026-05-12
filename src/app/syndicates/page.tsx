"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, ShieldAlert, Target, Activity, ChevronRight, User, Briefcase, Scale, Lock, Zap } from "lucide-react";

const SYNDICATES = [
  { id: "SYN_01", name: "The Waterfront Syndicate", origin: "Cape Town Port", focus: "Illicit Trade & Customs" },
  { id: "SYN_02", name: "Gauteng Procurement Ring", origin: "Johannesburg Central", focus: "State Tender Fraud" },
  { id: "SYN_03", name: "Logistics Hijack Unit X", origin: "Durban-JHB Corridor", focus: "Supply Chain Infiltration" },
];

const HIERARCHY = {
  id: "H_1",
  name: "THE HELM",
  role: "ANONYMOUS_COMMAND",
  type: "BOSS",
  risk: 99,
  children: [
    {
      id: "H_2",
      name: "Advocate Julian X",
      role: "STRATEGIC_FACILITATOR",
      type: "LEGAL",
      risk: 84,
      desc: "Provides total legal shielding and docket suppression services.",
      children: [
        { id: "H_5", name: "Lt. Colonel B. Mokoena", role: "OPERATIONAL_NODE", type: "POLICE", risk: 91, desc: "Facilitates evidence tampering at station level." },
        { id: "H_6", name: "Customs Officer Y", role: "LOGISTICS_PROXY", type: "OFFICIAL", risk: 88, desc: "Bypasses port security protocols." }
      ]
    },
    {
      id: "H_3",
      name: "CFO - Logistics Group Z",
      role: "FINANCIAL_PROXY",
      type: "CORPORATE",
      risk: 72,
      desc: "Manages offshore shell companies and money laundering loops.",
      children: [
        { id: "H_7", name: "Field Lead - Unit 12", role: "FIELD_COMMANDER", type: "CRIMINAL", risk: 95, desc: "Oversees street-level heist execution." }
      ]
    },
    {
      id: "H_4",
      name: "Director - Municipal Tenders",
      role: "POLITICAL_SHIELD",
      type: "GOVERNMENT",
      risk: 96,
      desc: "Ensures preferential tender allocation to syndicate proxies."
    }
  ]
};

export default function SyndicatePage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const renderNode = (node: any, level = 0) => (
    <div key={node.id} className="flex flex-col items-center gap-8 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: level * 0.1 }}
        onClick={() => setSelectedNode(node)}
        className={`glass-card p-6 min-w-[240px] text-center cursor-pointer border-border-glass bg-bg-glass hover:bg-bg-glass-bright transition-all group relative ${selectedNode?.id === node.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02] shadow-glow-crimson' : ''}`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2 py-0.5 bg-background border border-border-glass rounded text-[8px] font-mono tracking-widest uppercase text-muted-foreground">
          {node.type}
        </div>
        <h4 className="text-sm font-bold tracking-tight uppercase mb-1 text-foreground">{node.name}</h4>
        <p className="text-[9px] font-mono text-accent-gold font-bold tracking-[0.2em] mb-4">{node.role}</p>
        
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-[2px] bg-bg-glass-heavy rounded-full overflow-hidden">
            <div className="h-full bg-accent-crimson" style={{ width: `${node.risk}%` }} />
          </div>
          <span className="text-[10px] font-mono font-bold text-accent-crimson">{node.risk}%</span>
        </div>
      </motion.div>

      {node.children && (
        <div className="flex gap-12 relative pt-8">
          {/* Connection Lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-white/5" />
          <div className="absolute top-8 left-0 right-0 h-[2px] bg-white/5 mx-auto w-[calc(100%-240px)]" />
          
          {node.children.map((child: any) => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-crimson/30 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-crimson-opacity),transparent_50%)]" />
      
      <div className="container py-20 relative z-10 flex flex-col h-screen">
        <header className="mb-16 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-crimson/10 rounded-2xl flex items-center justify-center border border-accent-crimson/20 shadow-glow-crimson">
              <ShieldAlert className="w-6 h-6 text-accent-crimson" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Criminal Hierarchy Mapper</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase text-foreground">Syndicate Structures</h1>
            </div>
          </div>

          <div className="flex gap-4">
            {SYNDICATES.map(s => (
              <button key={s.id} className="px-6 py-2.5 bg-bg-glass border border-border-glass rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-bg-glass-bright transition-all text-muted-foreground hover:text-foreground">
                {s.name}
              </button>
            ))}
          </div>
        </header>

        {/* Hierarchy Tree Area */}
        <div className="flex-1 overflow-auto p-12 scrollbar-hide border border-border-glass rounded-3xl bg-bg-glass">
          <div className="min-w-fit flex justify-center">
            {renderNode(HIERARCHY)}
          </div>
        </div>

        {/* Selected Member Dossier Sidebar */}
        {selectedNode && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="absolute top-0 right-0 w-[450px] h-full glass-card border-l border-border-glass bg-background/60 backdrop-blur-2xl p-12 z-50 flex flex-col shadow-glow-crimson"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="self-end text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              Close Dossier [ESC]
            </button>

            <div className="flex-1 space-y-12">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-bg-glass border border-border-glass rounded text-[9px] font-mono tracking-widest uppercase text-muted-foreground mb-4">
                  Node_Type_{selectedNode.type}
                </div>
                <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none text-foreground">{selectedNode.name}</h2>
                <p className="text-[11px] font-mono text-accent-gold font-bold tracking-[0.3em] uppercase">{selectedNode.role}</p>
              </div>

              <div className="p-8 bg-bg-glass border border-border-glass rounded-2xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Intelligence Summary
                </p>
                <p className="text-sm text-foreground/60 leading-relaxed font-light italic">
                  "{selectedNode.desc || 'No detailed operational description available for this level of command.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-6 border-border-glass bg-bg-glass">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Direct Links</p>
                  <p className="text-2xl font-bold font-mono tracking-tighter text-foreground">{selectedNode.children?.length || 0}</p>
                </div>
                <div className="glass-card p-6 border-border-glass bg-bg-glass">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Score</p>
                  <p className="text-2xl font-bold font-mono tracking-tighter text-accent-crimson">{selectedNode.risk}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Infiltration Tactics</p>
                <div className="flex gap-4">
                  <div className="p-3 bg-bg-glass rounded-xl border border-border-glass"><Scale className="w-5 h-5 text-accent-blue" /></div>
                  <div className="p-3 bg-bg-glass rounded-xl border border-border-glass"><Lock className="w-5 h-5 text-accent-gold" /></div>
                  <div className="p-3 bg-bg-glass rounded-xl border border-border-glass"><Zap className="w-5 h-5 text-accent-crimson" /></div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button className="w-full py-5 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-glow">
                Generate Network Vulnerability Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
