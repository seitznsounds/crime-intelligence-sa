"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe, ChevronRight, Scale, Info, Loader2, Filter } from "lucide-react";
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
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [minRisk, setMinRisk] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getNetworkData();
    setNodes(data.nodes);
    setEdges(data.edges);
    setLoading(false);
  };

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesRisk = n.risk >= minRisk;
    return matchesSearch && matchesType && matchesRisk;
  });

  const filteredEdges = edges.filter(e => {
    const sourceId = typeof e.source === 'string' ? e.source : e.source?.id;
    const targetId = typeof e.target === 'string' ? e.target : e.target?.id;
    
    if (!sourceId || !targetId) return false;
    
    return filteredNodes.some(n => n.id === sourceId) && filteredNodes.some(n => n.id === targetId);
  });

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
        
        const infSourceId = selectedNode.id;
        const infTargetId = inf.id;

        if (!newEdges.some(e => {
          const s = typeof e.source === 'string' ? e.source : e.source?.id;
          const t = typeof e.target === 'string' ? e.target : e.target?.id;
          return (s === infSourceId && t === infTargetId) || (s === infTargetId && t === infSourceId);
        })) {
          newEdges.push({
            source: infSourceId,
            target: infTargetId,
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
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Re-Scan Links
          </button>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[750px]">
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full py-3 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest text-foreground flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" /> {showMobileFilters ? "Hide Filters" : "Show Intelligence Filters"}
        </button>

        {/* Filter Sidebar */}
        <div className={`w-full lg:w-72 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card p-6 border-border-glass bg-bg-glass space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Intelligence Filters
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Entity Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ID, Name, Role..." 
                    className="w-full bg-background border border-border-glass rounded-lg py-2 pl-9 pr-4 text-[11px] text-foreground focus:outline-none focus:border-accent-blue/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Classification</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-background border border-border-glass rounded-lg py-2 px-3 text-[11px] text-foreground focus:outline-none focus:border-accent-blue/50 appearance-none"
                >
                  <option value="all">All Entities</option>
                  <option value="PEP">Political Persons (PEP)</option>
                  <option value="ORG">Organizations / Syndicates</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Min Risk Index</label>
                  <span className="text-[10px] font-mono font-bold text-accent-crimson">{minRisk}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="99" 
                  value={minRisk}
                  onChange={(e) => setMinRisk(Number(e.target.value))}
                  className="w-full h-1 bg-border-glass rounded-lg appearance-none cursor-pointer accent-accent-crimson"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border-glass">
               <button 
                onClick={() => { setSearchQuery(""); setFilterType("all"); setMinRisk(0); }}
                className="w-full py-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
               >
                 Reset Filter Protocol
               </button>
            </div>
          </div>

          <div className="glass-card p-6 border-border-glass bg-bg-glass hidden lg:block">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Network Health</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase">Nodes In View</span>
                <span className="text-[10px] font-mono font-bold text-foreground">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase">Active Linkages</span>
                <span className="text-[10px] font-mono font-bold text-foreground">{filteredEdges.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative glass-card border-border-glass bg-bg-glass-heavy rounded-3xl overflow-hidden flex items-center justify-center min-h-[600px]">
          {/* Background Grid & Scan Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
          
          {loading ? (
            <div className="flex flex-col items-center gap-4 z-20">
              <Loader2 className="w-12 h-12 text-accent-crimson animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Decrypting Network Links...</p>
            </div>
          ) : (
            <D3NetworkMap 
              nodes={filteredNodes} 
              edges={filteredEdges.map(e => ({
                  ...e,
                  source: typeof e.source === 'string' ? e.source : e.source.id,
                  target: typeof e.target === 'string' ? e.target : e.target.id
              }))} 
              onNodeClick={setSelectedNode} 
            />
          )}

          {/* Legend Overlay - Bottom Left (Now inside Map Area, visible on all screens) */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 glass-card p-3 sm:p-4 border-border-glass bg-background/60 backdrop-blur-md z-20 shadow-lg scale-90 sm:scale-100 origin-bottom-left pointer-events-none">
            <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">Entity Classification</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-crimson shadow-glow-crimson" /><span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Criminal Syndicate</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-gold shadow-glow-gold" /><span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Political Person</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-blue shadow-glow-blue" /><span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State Agency / Org</span></div>
            </div>
          </div>

          {/* Dossier Side Panel (Now absolute within Map Area) */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-6 bottom-6 right-6 w-[calc(100%-3rem)] sm:w-full max-w-[340px] glass-card border-border-glass bg-background/90 backdrop-blur-2xl p-6 sm:p-8 z-50 shadow-glow-crimson flex flex-col overflow-y-auto"
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
                  <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2 text-foreground leading-tight">{selectedNode.name}</h2>
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
                              <span className="text-[11px] font-bold uppercase tracking-tight text-foreground break-all">{linkedTo.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground italic uppercase shrink-0 text-right">{edge.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-glass">
                   <div className="flex gap-2">
                    <button 
                      onClick={handleInferLinks}
                      disabled={isInferring}
                      className="flex-1 py-3 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-blue hover:text-white transition-all disabled:opacity-50"
                    >
                      {isInferring ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Infer unrecorded Links"}
                    </button>
                    <button className="flex-1 py-3 bg-foreground text-background text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-crimson hover:text-white transition-all">
                      Full Investigation
                    </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
