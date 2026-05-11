"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe } from "lucide-react";

const INITIAL_NODES = [
  { id: 1, name: "SAPS High Command", type: "ORG", x: 400, y: 300, risk: 85 },
  { id: 2, name: "Syndicate Alpha", type: "CRIM", x: 200, y: 150, risk: 98 },
  { id: 3, name: "Minister of Finance", type: "PEP", x: 600, y: 150, risk: 72 },
  { id: 4, name: "Logistics Hub B", type: "ORG", x: 300, y: 500, risk: 45 },
  { id: 5, name: "Customs Official X", type: "PEP", x: 500, y: 500, risk: 91 },
  { id: 6, name: "Offshore Entity 01", type: "CRIM", x: 700, y: 350, risk: 88 },
];

const INITIAL_EDGES = [
  { from: 1, to: 3, label: "Political Shield", weight: 0.8 },
  { from: 2, to: 1, label: "Docket Tampering", weight: 0.9 },
  { from: 2, to: 4, label: "Supply Route", weight: 0.6 },
  { from: 4, to: 5, label: "Border Facilitation", weight: 0.95 },
  { from: 5, to: 6, label: "Money Laundering", weight: 0.7 },
  { from: 6, to: 3, label: "Financial Kickback", weight: 0.85 },
];

export default function NetworkMapPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-accent-crimson/30">
      {/* Background Grid & Radar Sweep */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <motion.div 
        className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,59,48,0.03)_10deg,transparent_20deg)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Graph Canvas */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-10">
        <svg className="w-full h-full max-w-5xl max-h-[800px]" viewBox="0 0 800 600">
          {/* Edges / Connections */}
          {INITIAL_EDGES.map((edge, i) => {
            const fromNode = INITIAL_NODES.find(n => n.id === edge.from)!;
            const toNode = INITIAL_NODES.find(n => n.id === edge.to)!;
            return (
              <g key={i}>
                <motion.line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <motion.line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke="rgba(255,59,48,0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                  animate={{ strokeDashoffset: -100 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {INITIAL_NODES.map((node) => (
            <motion.g 
              key={node.id} 
              className="cursor-pointer group"
              onClick={() => setSelectedNode(node)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <circle 
                cx={node.x} cy={node.y} r="30" 
                className={`fill-black stroke-[1.5px] ${node.type === 'CRIM' ? 'stroke-accent-crimson' : node.type === 'PEP' ? 'stroke-accent-gold' : 'stroke-accent-blue'}`}
              />
              <circle 
                cx={node.x} cy={node.y} r="38" 
                className="fill-transparent stroke-white/5 stroke-[0.5px] group-hover:stroke-white/20 transition-all"
              />
              <text 
                x={node.x} y={node.y + 50} 
                className="fill-white/40 text-[9px] font-bold uppercase tracking-[0.2em] text-center"
                textAnchor="middle"
              >
                {node.name}
              </text>
              <text 
                x={node.x} y={node.y + 4} 
                className="fill-white/80 text-[10px] font-mono font-bold"
                textAnchor="middle"
              >
                {node.risk}%
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Technical HUD Overlay */}
        <div className="absolute top-10 left-10 space-y-6 max-w-sm pointer-events-none">
          <div className="glass-card p-6 border-white/5 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4 text-accent-crimson">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Network Link Analysis</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/20">ACTIVE_NODES</span>
                <span className="text-white/60">324</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/20">DETECTED_LINKS</span>
                <span className="text-white/60">1,204</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/20">INTEGRITY_INDEX</span>
                <span className="text-accent-gold font-bold">CRITICAL_OVERFLOW</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 border-white/5 bg-black/40">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-3">Operational Legend</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent-crimson" /><span className="text-[8px] uppercase text-white/40">Syndicate</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent-gold" /><span className="text-[8px] uppercase text-white/40">PEP</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent-blue" /><span className="text-[8px] uppercase text-white/40">Agency</span></div>
            </div>
          </div>
        </div>

        {/* Selection Sidebar */}
        {selectedNode && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="absolute top-0 right-0 w-[400px] h-full glass-card border-l border-white/10 bg-black/60 backdrop-blur-2xl p-10 z-50 flex flex-col"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="self-end text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors mb-10"
            >
              Close Dossier [ESC]
            </button>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[9px] font-bold tracking-widest uppercase rounded border border-accent-crimson/20 mb-4">
                Node_Investigation_{selectedNode.id}
              </div>
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">{selectedNode.name}</h2>
              <p className="text-sm text-white/40 font-mono mb-8 uppercase tracking-widest">Type: {selectedNode.type}</p>

              <div className="space-y-6">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Threat Profile</p>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      className="h-full bg-accent-crimson"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNode.risk}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/40">Risk Probability</span>
                    <span className="text-accent-crimson font-bold">{selectedNode.risk}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Established Links</p>
                  {INITIAL_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                    const linkedTo = INITIAL_NODES.find(n => n.id === (edge.from === selectedNode.id ? edge.to : edge.from))!;
                    return (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.03]">
                        <div className="flex items-center gap-3">
                          <Zap className="w-3.5 h-3.5 text-accent-gold" />
                          <span className="text-xs font-bold uppercase tracking-tight">{linkedTo.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/20 italic">{edge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button className="w-full py-4 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-glow">
                Request Deep Surveillance
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action HUD */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 glass-card px-8 py-4 border-white/5 bg-black/40 backdrop-blur-md">
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          <Globe className="w-4 h-4" /> Global Map
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-accent-crimson font-bold">
          <Network className="w-4 h-4" /> Link Graph
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          <Activity className="w-4 h-4" /> Live Intercepts
        </button>
      </div>
    </div>
  );
}
