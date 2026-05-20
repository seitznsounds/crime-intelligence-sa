"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Network, Activity, ShieldAlert, Zap, Search, Fingerprint, Globe, ChevronRight, Scale, Info, Loader2, Filter, Target, Share2, Layers, X, Users, Megaphone } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getNetworkData, inferLinks } from "./actions";
import { D3NetworkMap } from "@/components/intel/D3NetworkMap";
import { IntelligenceDrawer } from "@/components/intel/IntelligenceDrawer";
import { AytadaAd } from "@/components/ui/AytadaAd";
import WhatNext from "@/components/layout/WhatNext";

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
  
  // UI States
  const [focalMode, setFocalMode] = useState(true);
  const [showInferred, setShowInferred] = useState(true);
  const [clusterStrength, setClusterMode] = useState(1); // 1: Default, 2: High Force
  
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

  // Improved Filtering: Focal Mode hides everything but the target's immediate neighborhood
  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesRisk = n.risk >= minRisk;
    
    if (selectedNode && focalMode) {
        const isNeighbor = edges.some(e => {
            const s = typeof e.source === 'string' ? e.source : e.source?.id;
            const t = typeof e.target === 'string' ? e.target : e.target?.id;
            return (s === selectedNode.id && t === n.id) || (t === selectedNode.id && s === n.id);
        });
        return (n.id === selectedNode.id || isNeighbor) && matchesSearch && matchesType && matchesRisk;
    }

    return matchesSearch && matchesType && matchesRisk;
  });

  const filteredEdges = edges.filter(e => {
    const sourceId = typeof e.source === 'string' ? e.source : e.source?.id;
    const targetId = typeof e.target === 'string' ? e.target : e.target?.id;
    
    if (!sourceId || !targetId) return false;
    
    // AI Deduction Filter
    if (e.isInferred && !showInferred) return false;
    
    return filteredNodes.some(n => n.id === sourceId) && filteredNodes.some(n => n.id === targetId);
  });

  return (
    <PageShell
      title="Corruption Connections"
      subtitle="Interactive map showing how corrupt officials, syndicates, and organisations are connected to each other."
      badge="Network Analysis"
      badgeColor="crimson"
      icon={<Network className="w-6 h-6 text-accent-crimson" />}
      guidance="This page shows a visual map of how people and organisations linked to corruption are connected. Click on any dot (node) to see that person's connections. Use the filters on the left to narrow down what you see."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Explore", href: "/expose" },
        { label: "Corruption Connections", href: "/network" },
      ]}
      actions={
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedNode(null)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <Target className="w-3.5 h-3.5" /> Clear Focus
          </button>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
          >
             <Zap className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
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
          <Filter className="w-4 h-4" /> {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filter Sidebar */}
        <div className={`w-full lg:w-80 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card p-6 border-border-glass bg-bg-glass space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue flex items-center gap-2 mb-4">
                <Target className="w-3.5 h-3.5" /> View Mode
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-background/40 border border-border-glass rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${focalMode ? 'bg-accent-blue/10 text-accent-blue' : 'bg-white/5 text-muted-foreground'}`}>
                        <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-tight block">Focus Mode</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Show only connected</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => setFocalMode(!focalMode)}
                    className={`w-12 h-6 rounded-full transition-all relative p-1 ${focalMode ? 'bg-accent-blue' : 'bg-charcoal-3'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${focalMode ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background/40 border border-border-glass rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${showInferred ? 'bg-accent-gold/10 text-accent-gold' : 'bg-white/5 text-muted-foreground'}`}>
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-tight block">AI Predictions</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Show predicted links</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => setShowInferred(!showInferred)}
                    className={`w-12 h-6 rounded-full transition-all relative p-1 ${showInferred ? 'bg-accent-gold' : 'bg-charcoal-3'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${showInferred ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Layout Density</label>
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map(v => (
                        <button 
                            key={v}
                            onClick={() => setClusterMode(v)}
                            className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${clusterStrength === v ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' : 'bg-white/5 border-border-glass text-muted-foreground'}`}
                        >
                            {v === 1 ? 'Organic' : 'Condensed'}
                        </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border-glass space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue flex items-center gap-2 mb-4">
                <Filter className="w-3.5 h-3.5" /> Filters
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Search People & Organisations</label>
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..." 
                        className="w-full bg-background border border-border-glass rounded-xl py-3 pl-10 pr-4 text-[11px] text-foreground focus:outline-none focus:border-accent-blue/50 transition-all shadow-inner"
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Filter by Type</label>
                    <div className="grid grid-cols-1 gap-2">
                        {['all', 'PEP', 'ORG'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase text-left transition-all border ${filterType === t ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue' : 'bg-background/20 border-border-glass text-muted-foreground hover:bg-white/5'}`}
                            >
                                {t === 'all' ? 'All Entities' : t === 'PEP' ? 'Political (PEP)' : 'Organizations'}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>

          <AytadaAd className="hidden lg:block" />
        </div>

        {/* Map Area */}
        <div className="flex-1 relative glass-card border-border-glass bg-bg-glass-heavy rounded-3xl overflow-hidden min-h-[600px] lg:min-h-[750px] shadow-2xl">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] opacity:20" />
          
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <Loader2 className="w-12 h-12 text-accent-blue animate-spin" />
              <p className="text-[11px] font-black uppercase tracking-widest text-accent-blue animate-pulse">Loading network data...</p>
            </div>
          ) : (
            <div className="absolute inset-0 z-10">
              <D3NetworkMap 
                nodes={filteredNodes} 
                edges={filteredEdges.map(e => ({
                    ...e,
                    source: typeof e.source === 'string' ? e.source : e.source.id,
                    target: typeof e.target === 'string' ? e.target : e.target.id
                }))} 
                onNodeClick={(node) => {
                    setSelectedNode(node);
                }}
                clusterStrength={clusterStrength}
              />
            </div>
          )}

          {/* Focal Breadcrumb */}
          {selectedNode && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-accent-blue/10 border border-accent-blue/30 rounded-full backdrop-blur-md"
              >
                  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue">Focused: {selectedNode.name}</span>
                  <button onClick={() => setSelectedNode(null)} className="ml-2 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                  </button>
              </motion.div>
          )}

          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 glass-card p-5 border-border-glass bg-background/80 backdrop-blur-xl z-20 shadow-2xl scale-90 sm:scale-100 origin-bottom-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border-glass pb-2">Legend</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-accent-crimson shadow-glow-crimson" /><span className="text-[10px] font-black uppercase tracking-tighter text-foreground">Crime Syndicate</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-accent-gold shadow-glow-gold" /><span className="text-[10px] font-black uppercase tracking-tighter text-foreground">Politician / Official</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-accent-blue shadow-glow-blue" /><span className="text-[10px] font-black uppercase tracking-tighter text-foreground">Government Agency</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-[1.5px] bg-accent-gold border border-accent-gold/50 border-dashed" /><span className="text-[8px] font-black uppercase tracking-tighter text-accent-gold/80">AI Predicted Link</span></div>
            </div>
          </div>

          <IntelligenceDrawer 
            isOpen={!!selectedNode} 
            onClose={() => setSelectedNode(null)} 
            entityId={selectedNode?.id || null}
            entityType={selectedNode?.type || 'Unknown'}
            entityName={selectedNode?.name || 'Unknown Entity'}
            baseRisk={selectedNode?.risk || 0}
          />
        </div>
      </div>

      <WhatNext suggestions={[
        { title: "People of Interest", description: "Browse detailed profiles of the people shown on this map.", href: "/expose", icon: Search },
        { title: "Crime Syndicates", description: "Explore the hierarchies of organised crime groups.", href: "/syndicates", icon: Users },
        { title: "Report What You Know", description: "Have information about these connections? Report it anonymously.", href: "/report", icon: Megaphone },
      ]} />
    </PageShell>
  );
}
