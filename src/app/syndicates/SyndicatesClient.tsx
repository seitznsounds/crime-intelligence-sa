"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Users, ShieldAlert, Activity, Scale, Lock, Zap, Search, ChevronRight, Gavel, Target } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { IntelligenceDrawer } from "@/components/intel/IntelligenceDrawer";

interface Node {
  id: string;
  name: string;
  role: string;
  type: string;
  risk: number;
  desc?: string;
  children?: Node[];
}

interface Syndicate {
  id: string;
  name: string;
  origin: string;
  focus: string;
  description?: string;
  hierarchy: Node | null;
}

export default function SyndicatePage({ initialSyndicates }: { initialSyndicates: Syndicate[] }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedSyndicateAsNode, setSelectedSyndicateAsNode] = useState<Node | null>(null);
  const [activeSyndicateId, setActiveSyndicateId] = useState(initialSyndicates[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSyndicates = initialSyndicates.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.focus.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // Put gangs/cartels at the top
    const priority = (name: string) => 
        name.includes('Gang') || name.includes('Cartel') || name.includes('Syndicate') || name.includes('Mafia') ? 0 : 1;
    return priority(a.name) - priority(b.name);
  });

  const activeSyndicate = initialSyndicates.find(s => s.id === activeSyndicateId);
  const hierarchy = activeSyndicate?.hierarchy;

  if (initialSyndicates.length === 0) {
    return (
      <PageShell
        title="Syndicate Structures"
        subtitle="Automated organizational chart mapping of major criminal syndicates."
        badge="Criminal Hierarchy Mapper"
        badgeColor="crimson"
        icon={<ShieldAlert className="w-6 h-6 text-accent-crimson" />}
      >
        <div className="flex flex-col items-center justify-center h-[400px] glass-card border-border-glass bg-bg-glass">
          <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">No Syndicate Data Available</h3>
          <p className="text-muted-foreground">The intelligence database currently contains no verified syndicate hierarchies.</p>
        </div>
      </PageShell>
    );
  }

  const renderNode = (node: Node, level = 0): React.ReactNode => (
    <div key={node.id} className="flex flex-col items-center gap-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: level * 0.1 }} 
        onClick={() => setSelectedNode(node)}
        className={`glass-card p-5 min-w-[200px] sm:min-w-[240px] text-center cursor-pointer border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group relative ${selectedNode?.id === node.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-background border border-border-glass rounded text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            {node.type}
        </div>
        <h4 className="text-[13px] font-bold tracking-tight uppercase mb-1 text-foreground">{node.name}</h4>
        <p className="text-[11px] font-mono text-accent-gold font-bold tracking-[0.2em] mb-3">{node.role}</p>
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-[2px] bg-bg-glass-heavy rounded-full overflow-hidden">
            <div className="h-full bg-accent-crimson shadow-glow-crimson" style={{ width: `${node.risk}%` }} />
          </div>
          <span className="text-[11px] font-mono font-bold text-accent-crimson shrink-0">{node.risk}%</span>
        </div>
      </motion.div>
      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 sm:gap-12 relative pt-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-border-glass" />
          <div className="absolute top-6 left-0 right-0 h-[2px] bg-border-glass" />
          {node.children.map((child) => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <PageShell
      title="Syndicate Structures"
      subtitle="Automated organizational chart mapping — from street-level enforcers to high-court defendants."
      badge="Criminal Hierarchy Mapper"
      badgeColor="crimson"
      icon={<ShieldAlert className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investigate", href: "/expose" }, { label: "Syndicate Structures", href: "/syndicates" }]}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[600px] sm:h-[850px]">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-4 shrink-0 flex flex-col h-full overflow-hidden">
          <div className="glass-card p-5 border-border-glass bg-bg-glass flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-crimson mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Tracked Networks
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <input 
                type="text"
                placeholder="Search corpus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border-glass rounded-xl py-2 pl-10 pr-4 text-[11px] focus:border-accent-crimson/50 transition-all outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-2">
              {filteredSyndicates.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setActiveSyndicateId(s.id);
                    setSelectedNode(null);
                  }} 
                  className={`flex flex-col text-left px-4 py-3 rounded-xl transition-all border ${
                    activeSyndicateId === s.id 
                      ? 'bg-accent-crimson/10 border-accent-crimson/30 shadow-glow-crimson' 
                      : 'bg-background/20 border-border-glass hover:bg-bg-glass hover:border-border-glass-bright'
                  }`}
                >
                  <span className={`text-[12px] font-bold uppercase tracking-tight ${activeSyndicateId === s.id ? 'text-accent-crimson' : 'text-foreground'}`}>{s.name}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">{s.focus}</span>
                    {s.hierarchy && <Zap className="w-2.5 h-2.5 text-accent-gold animate-pulse" />}
                  </div>
                </button>
              ))}
            </div>

            {activeSyndicate && (
              <button 
                onClick={() => setSelectedSyndicateAsNode({
                  id: activeSyndicate.id,
                  name: activeSyndicate.name,
                  type: 'Organization',
                  role: 'SYNDICATE HUB',
                  risk: 90,
                  desc: activeSyndicate.description
                })}
                className="w-full mt-6 py-4 bg-foreground text-background text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 shadow-2xl"
              >
                <ShieldAlert className="w-4 h-4" /> Deep Profile
              </button>
            )}
          </div>
        </div>

        {/* Hierarchy Tree */}
        <div className="flex-1 overflow-auto p-6 sm:p-12 border border-border-glass rounded-3xl bg-bg-glass-heavy scrollbar-hide relative flex items-center justify-center">
          <div className="min-w-fit pt-6 pb-12 w-full flex items-center justify-center">
            {hierarchy ? renderNode(hierarchy) : (
               <div className="flex flex-col items-center justify-center h-full max-w-md text-center space-y-8">
                <div className="p-8 bg-white/5 border border-white/10 rounded-full relative">
                    <Users className="w-16 h-16 text-muted-foreground/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-accent-crimson/40" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Hierarchy Resolution Pending</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tighter font-medium italic">
                        Forensic links for <span className="text-foreground font-black not-italic">{activeSyndicate?.name}</span> are currently being cross-referenced from Sabinet high-court judgments and field news. 
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="glass-card p-5 border-border-glass bg-bg-glass">
                        <span className="text-[9px] font-black text-accent-blue uppercase block mb-1 tracking-widest">Inferred Risk</span>
                        <span className="text-2xl font-black font-mono">92%</span>
                    </div>
                    <div className="glass-card p-5 border-border-glass bg-bg-glass">
                        <span className="text-[9px] font-black text-accent-gold uppercase block mb-1 tracking-widest">Legal Nodes</span>
                        <span className="text-2xl font-black font-mono">LOCKED</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                    <Activity className="w-3 h-3" /> Recursive Link Discovery in Progress...
                </div>
              </div>
            )}
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

        <IntelligenceDrawer 
          isOpen={!!selectedSyndicateAsNode} 
          onClose={() => setSelectedSyndicateAsNode(null)} 
          entityId={selectedSyndicateAsNode?.id || null}
          entityType={selectedSyndicateAsNode?.type || 'Organization'}
          entityName={selectedSyndicateAsNode?.name || 'Unknown Syndicate'}
          baseRisk={selectedSyndicateAsNode?.risk || 0}
        />
      </div>
    </PageShell>
  );
}
