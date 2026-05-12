"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe, ChevronRight, Scale, Info } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const INITIAL_NODES = [
  { id: 1, name: "SAPS High Command", type: "ORG", x: 400, y: 300, risk: 85, color: "var(--accent-blue)" },
  { id: 2, name: "Syndicate Alpha", type: "CRIM", x: 200, y: 150, risk: 98, color: "var(--accent-crimson)" },
  { id: 3, name: "Minister of Finance", type: "PEP", x: 600, y: 150, risk: 72, color: "var(--accent-gold)" },
  { id: 4, name: "Logistics Hub B", type: "ORG", x: 300, y: 500, risk: 45, color: "var(--accent-blue)" },
  { id: 5, name: "Customs Official X", type: "PEP", x: 500, y: 500, risk: 91, color: "var(--accent-gold)" },
  { id: 6, name: "Offshore Entity 01", type: "CRIM", x: 700, y: 350, risk: 88, color: "var(--accent-crimson)" },
];

const INITIAL_EDGES = [
  { from: 1, to: 3, label: "Political Shield", weight: 0.8 },
  { from: 2, to: 1, label: "Docket Tampering", weight: 0.9 },
  { from: 2, to: 4, label: "Supply Route", weight: 0.6 },
  { from: 4, to: 5, label: "Border Facilitation", weight: 0.95 },
  { from: 5, to: 6, label: "Money Laundering", weight: 0.7 },
  { from: 6, to: 3, label: "Financial Kickback", weight: 0.85 },
];

interface Node {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  risk: number;
  color: string;
}

export default function NetworkMapPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <PageShell
      title="Corruption Network Map"
      subtitle="Interactive visualization of corruption links between organized crime, political figures, and state institutions."
      badge="Network Intelligence"
      badgeColor="crimson"
      icon={<Network className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Investigate", href: "/expose" },
        { label: "Network Map", href: "/network" },
      ]}
      actions={
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search entities..." 
              className="bg-bg-glass border border-border-glass rounded-xl py-2 pl-9 pr-4 text-[11px] text-foreground focus:outline-none focus:border-accent-crimson/50 w-48 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <Zap className="w-3.5 h-3.5" /> Re-Scan Links
          </button>
        </div>
      }
    >
      <div className="relative w-full h-[600px] sm:h-[750px] glass-card border-border-glass bg-bg-glass-heavy rounded-3xl overflow-hidden flex items-center justify-center">
        {/* Background Grid & Scan Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        <motion.div 
          className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,var(--accent-crimson-opacity)_10deg,transparent_20deg)] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Graph Canvas */}
        <svg className="relative z-10 w-full h-full max-w-4xl max-h-[700px]" viewBox="0 0 800 600">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="35" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-glass-bright)" />
            </marker>
          </defs>

          {/* Connections */}
          {INITIAL_EDGES.map((edge, i) => {
            const fromNode = INITIAL_NODES.find(n => n.id === edge.from)!;
            const toNode = INITIAL_NODES.find(n => n.id === edge.to)!;
            return (
              <g key={i}>
                <motion.line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke="var(--border-glass)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
                <motion.circle 
                  r="2" 
                  fill="var(--accent-crimson)"
                  animate={{ cx: [fromNode.x, toNode.x], cy: [fromNode.y, toNode.y] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                />
              </g>
            );
          })}

          {/* Entities */}
          {INITIAL_NODES.map((node) => (
            <motion.g 
              key={node.id} 
              className="cursor-pointer group"
              onClick={() => setSelectedNode(node)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <circle 
                cx={node.x} cy={node.y} r="32" 
                className="fill-background stroke-[2px] transition-colors duration-300"
                style={{ stroke: node.color }}
              />
              <circle 
                cx={node.x} cy={node.y} r="40" 
                className="fill-transparent stroke-border-glass stroke-[0.5px] group-hover:stroke-border-glass-bright transition-all"
              />
              <text 
                x={node.x} y={node.y + 55} 
                className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest"
                textAnchor="middle"
              >
                {node.name}
              </text>
              <text 
                x={node.x} y={node.y + 4} 
                className="fill-foreground/90 text-[11px] font-mono font-bold"
                textAnchor="middle"
              >
                {node.risk}%
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Legend Overlay - Bottom Left */}
        <div className="absolute bottom-6 left-6 glass-card p-4 border-border-glass bg-background/40 backdrop-blur-md hidden md:block">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Entity Classification</h4>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-crimson shadow-glow-crimson" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Criminal Syndicate</span></div>
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-glow-gold" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Political Person</span></div>
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-glow-blue" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State Agency</span></div>
          </div>
        </div>

        {/* Dossier Side Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-6 bottom-6 right-6 w-[360px] glass-card border-border-glass bg-background/80 backdrop-blur-2xl p-8 z-50 shadow-glow-crimson flex flex-col overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="self-end text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                Close Dossier [X]
              </button>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[10px] font-bold tracking-widest uppercase rounded border border-accent-crimson/20 mb-4">
                  Case_Study_{selectedNode.id}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-foreground">{selectedNode.name}</h2>
                <p className="text-[11px] text-muted-foreground font-mono mb-8 uppercase tracking-widest">Classification: {selectedNode.type}</p>

                <div className="space-y-6">
                  <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Involvement Probability</p>
                    <div className="h-2 bg-bg-glass-heavy rounded-full overflow-hidden mb-4">
                      <motion.div 
                        className="h-full bg-accent-crimson shadow-glow-crimson"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.risk}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-muted-foreground">Threat Score</span>
                      <span className="text-accent-crimson font-bold">{selectedNode.risk}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border-glass pb-2">Identified Associations</p>
                    {INITIAL_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                      const linkedTo = INITIAL_NODES.find(n => n.id === (edge.from === selectedNode.id ? edge.to : edge.from))!;
                      return (
                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-border-glass/50">
                          <div className="flex items-center gap-3">
                            <Fingerprint className="w-3.5 h-3.5 text-accent-gold" />
                            <span className="text-[11px] font-bold uppercase tracking-tight text-foreground">{linkedTo.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground italic uppercase">{edge.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-glass">
                <button className="w-full py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all shadow-glow group">
                  Initiate Full Investigation <ChevronRight className="w-3.5 h-3.5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Network Stats HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {[
          { label: "Indexed Entities", value: "324", icon: <Fingerprint className="w-4 h-4 text-accent-blue" /> },
          { label: "Detected Links", value: "1,204", icon: <Activity className="w-4 h-4 text-accent-crimson" /> },
          { label: "System Confidence", value: "94.2%", icon: <Scale className="w-4 h-4 text-accent-gold" /> },
          { label: "Last Analysis", value: "2m ago", icon: <Info className="w-4 h-4 text-muted-foreground/60" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-5 border-border-glass bg-bg-glass flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">{item.label}</span>
              <p className="text-xl font-bold tracking-tighter text-foreground">{item.value}</p>
            </div>
            <div className="p-2.5 bg-bg-glass-heavy rounded-xl border border-border-glass">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
