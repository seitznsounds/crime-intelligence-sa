"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, ShieldAlert, Activity, Scale, Lock, Zap } from "lucide-react";
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
  hierarchy: Node | null;
}

export default function SyndicatePage({ initialSyndicates }: { initialSyndicates: Syndicate[] }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeSyndicateId, setActiveSyndicateId] = useState(initialSyndicates[0]?.id);

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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: level * 0.1 }} onClick={() => setSelectedNode(node)}
        className={`glass-card p-5 min-w-[200px] sm:min-w-[240px] text-center cursor-pointer border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group relative ${selectedNode?.id === node.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-background border border-border-glass rounded text-[10px] font-mono tracking-widest uppercase text-muted-foreground">{node.type}</div>
        <h4 className="text-[13px] font-bold tracking-tight uppercase mb-1 text-foreground">{node.name}</h4>
        <p className="text-[11px] font-mono text-accent-gold font-bold tracking-[0.2em] mb-3">{node.role}</p>
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-[2px] bg-bg-glass-heavy rounded-full overflow-hidden"><div className="h-full bg-accent-crimson" style={{ width: `${node.risk}%` }} /></div>
          <span className="text-[11px] font-mono font-bold text-accent-crimson shrink-0">{node.risk}%</span>
        </div>
      </motion.div>
      {node.children && (
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
      subtitle="Automated organizational chart mapping of major criminal syndicates — from field operatives to anonymous command layers."
      badge="Criminal Hierarchy Mapper"
      badgeColor="crimson"
      icon={<ShieldAlert className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investigate", href: "/expose" }, { label: "Syndicate Structures", href: "/syndicates" }]}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[600px] sm:h-[750px]">
        {/* Syndicate Selection Sidebar */}
        <div className="w-full lg:w-64 space-y-4 shrink-0 flex flex-col">
          <div className="glass-card p-5 border-border-glass bg-bg-glass">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-crimson mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Tracked Syndicates
            </h3>
            <div className="flex flex-col gap-2">
              {initialSyndicates.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setActiveSyndicateId(s.id);
                    setSelectedNode(null);
                  }} 
                  className={`flex flex-col text-left px-4 py-3 rounded-xl transition-all border ${
                    activeSyndicateId === s.id 
                      ? 'bg-accent-crimson/10 border-accent-crimson/30 shadow-glow-crimson' 
                      : 'bg-background border-border-glass hover:bg-bg-glass hover:border-border-glass-bright'
                  }`}
                >
                  <span className={`text-[12px] font-bold uppercase tracking-tight ${activeSyndicateId === s.id ? 'text-accent-crimson' : 'text-foreground'}`}>{s.name}</span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{s.focus}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-5 border-border-glass bg-bg-glass hidden lg:block mt-auto">
             <p className="text-[10px] text-muted-foreground leading-relaxed italic">
               Select a syndicate to view its verified hierarchy. Operations and personnel are mapped dynamically from forensic links.
             </p>
          </div>
        </div>

        {/* Hierarchy Tree */}
        <div className="flex-1 overflow-auto p-6 sm:p-8 border border-border-glass rounded-3xl bg-bg-glass-heavy scrollbar-hide relative flex items-center justify-center">
          <div className="min-w-fit pt-6 pb-12">
            {hierarchy ? renderNode(hierarchy) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Hierarchy mapping pending for {activeSyndicate?.name}</p>
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
      </div>
    </PageShell>
  );
}

