"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe, ChevronRight, Scale, Info, Loader2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getNetworkData, inferLinks } from "./actions";
import { D3NetworkMap } from "@/components/intel/D3NetworkMap";

export default function NetworkMapPage({ 
  initialNodes, 
  initialEdges 
}: { 
  initialNodes: any[], 
  initialEdges: any[] 
}) {
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);
  const [loading, setLoading] = useState(false);
  const [isInferring, setIsInferring] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getNetworkData();
    setNodes(data.nodes);
    setEdges(data.edges);
    setLoading(false);
  };

  const handleInferLinks = async () => {
    if (!selectedNode) return;
    setIsInferring(true);
    try {
      const inferred = await inferLinks(selectedNode.id, selectedNode.type);
      
      const newNodes = [...nodes];
      const newEdges = [...edges];

      inferred.forEach(inf => {
        if (!newNodes.some(n => n.id === inf.id)) {
          newNodes.push({
            ...inf,
            color: inf.type === 'PEP' ? 'var(--accent-gold)' : 'var(--accent-blue)'
          });
        }
        
        if (!newEdges.some(e => 
          ((e.source === selectedNode.id || e.source.id === selectedNode.id) && (e.target === inf.id || e.target.id === inf.id)) || 
          ((e.source === inf.id || e.source.id === inf.id) && (e.target === selectedNode.id || e.target.id === selectedNode.id))
        )) {
          newEdges.push({
            source: selectedNode.id,
            target: inf.id,
            label: `INFERRED_${Math.floor(inf.similarity * 100)}%`,
            weight: inf.similarity,
            isInferred: true
          });
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (e) {
      console.error("Inference error:", e);
    } finally {
      setIsInferring(false);
    }
  };

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
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Re-Scan Links
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

        {loading ? (
          <div className="flex flex-col items-center gap-4 z-20">
            <Loader2 className="w-12 h-12 text-accent-crimson animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Decrypting Network Links...</p>
          </div>
        ) : (
          <D3NetworkMap 
            nodes={nodes} 
            edges={edges.map(e => ({
                ...e,
                source: e.from,
                target: e.to
            }))} 
            onNodeClick={setSelectedNode} 
          />
        )}

        {/* Legend Overlay - Bottom Left */}
        <div className="absolute bottom-6 left-6 glass-card p-4 border-border-glass bg-background/40 backdrop-blur-md hidden md:block">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Entity Classification</h4>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-crimson shadow-glow-crimson" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Criminal Syndicate</span></div>
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-glow-gold" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Political Person</span></div>
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-glow-blue" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State Agency / Org</span></div>
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
                  Entity_Profile_{selectedNode.id.substring(0, 8)}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-foreground leading-tight">{selectedNode.name}</h2>
                <p className="text-[11px] text-muted-foreground font-mono mb-8 uppercase tracking-widest">Classification: {selectedNode.type}</p>

                <div className="space-y-6">
                  <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Risk Exposure Index</p>
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
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border-glass pb-2">Verified Connections</p>
                    {edges.filter(e => (typeof e.source === 'string' ? e.source : e.source.id) === selectedNode.id || (typeof e.target === 'string' ? e.target : e.target.id) === selectedNode.id).map((edge, i) => {
                      const otherId = (typeof edge.source === 'string' ? edge.source : edge.source.id) === selectedNode.id 
                        ? (typeof edge.target === 'string' ? edge.target : edge.target.id) 
                        : (typeof edge.source === 'string' ? edge.source : edge.source.id);
                      const linkedTo = nodes.find(n => n.id === otherId);
                      if (!linkedTo) return null;
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
          { label: "Active Nodes", value: nodes.length, icon: <Fingerprint className="w-4 h-4 text-accent-blue" /> },
          { label: "Detected Links", value: edges.length, icon: <Activity className="w-4 h-4 text-accent-crimson" /> },
          { label: "System Confidence", value: "94.2%", icon: <Scale className="w-4 h-4 text-accent-gold" /> },
          { label: "Last Analysis", value: loading ? "Updating..." : "Live", icon: <Info className="w-4 h-4 text-muted-foreground/60" /> }
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
