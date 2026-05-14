"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe, ChevronRight, Scale, Info, Loader2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getNetworkData, inferLinks } from "./actions";

interface Node {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  risk: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
  weight: number;
  isInferred?: boolean;
}

export default function NetworkMapPage({ 
  initialNodes, 
  initialEdges 
}: { 
  initialNodes: Node[], 
  initialEdges: Edge[] 
}) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [loading, setLoading] = useState(false);
  const [isInferring, setIsInferring] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const requestRef = useRef<number>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getNetworkData();
    const validEdges = data.edges.filter(e => 
      data.nodes.some(n => n.id === e.from) && 
      data.nodes.some(n => n.id === e.to)
    );
    setNodes(data.nodes);
    setEdges(validEdges);
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
            x: selectedNode.x + (Math.random() - 0.5) * 100,
            y: selectedNode.y + (Math.random() - 0.5) * 100,
            color: inf.type === 'PEP' ? 'var(--accent-gold)' : 'var(--accent-blue)'
          });
        }
        
        if (!newEdges.some(e => (e.from === selectedNode.id && e.to === inf.id) || (e.from === inf.id && e.to === selectedNode.id))) {
          newEdges.push({
            from: selectedNode.id,
            to: inf.id,
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

  // Simple Force-Directed Layout
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(n => ({ ...n, vx: n.vx || 0, vy: n.vy || 0 }));
        
        // 1. Repulsion between nodes
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[i].x - newNodes[j].x;
            const dy = newNodes[i].y - newNodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            newNodes[i].vx! += fx;
            newNodes[i].vy! += fy;
            newNodes[j].vx! -= fx;
            newNodes[j].vy! -= fy;
          }
        }

        // 2. Attraction along edges
        edges.forEach(edge => {
          const source = newNodes.find(n => n.id === edge.from);
          const target = newNodes.find(n => n.id === edge.to);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (distance - 150) * 0.05;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            source.vx! += fx;
            source.vy! += fy;
            target.vx! -= fx;
            target.vy! -= fy;
          }
        });

        // 3. Center gravity
        newNodes.forEach(n => {
          const dx = 400 - n.x;
          const dy = 300 - n.y;
          n.vx! += dx * 0.01;
          n.vy! += dy * 0.01;
        });

        // 4. Apply velocity and damping
        return newNodes.map(n => {
          const damping = 0.9;
          const nextX = n.x + (n.vx! * damping);
          const nextY = n.y + (n.vy! * damping);
          
          // Constrain to canvas
          return {
            ...n,
            x: Math.max(50, Math.min(750, nextX)),
            y: Math.max(50, Math.min(550, nextY)),
            vx: n.vx! * damping,
            vy: n.vy! * damping
          };
        });
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [edges.length > 0]); // Re-run when edges are loaded

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
          <svg className="relative z-10 w-full h-full max-w-4xl max-h-[700px]" viewBox="0 0 800 600">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="35" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-glass-bright)" />
              </marker>
            </defs>

            {/* Connections */}
            {edges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <g key={i}>
                  <line
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x} y2={toNode.y}
                    stroke={edge.isInferred ? "var(--accent-gold)" : "var(--border-glass)"}
                    strokeWidth={edge.isInferred ? "1" : "1.5"}
                    strokeDasharray={edge.isInferred ? "4,4" : "0"}
                    markerEnd={edge.isInferred ? "" : "url(#arrowhead)"}
                    className={edge.isInferred ? "opacity-60" : "opacity-100"}
                  />
                  {!edge.isInferred && (
                    <motion.circle 
                      r="2" 
                      fill="var(--accent-crimson)"
                      animate={{ cx: [fromNode.x, toNode.x], cy: [fromNode.y, toNode.y] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    />
                  )}
                </g>
              );
            })}

            {/* Entities */}
            {nodes.map((node) => (
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
                  {node.name.length > 20 ? node.name.substring(0, 17) + "..." : node.name}
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
                    {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                      const linkedTo = nodes.find(n => n.id === (edge.from === selectedNode.id ? edge.to : edge.from))!;
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
