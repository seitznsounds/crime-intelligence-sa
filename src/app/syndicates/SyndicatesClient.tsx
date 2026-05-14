"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, ShieldAlert, Activity, Scale, Lock, Zap } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

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
      actions={
        <div className="flex flex-wrap gap-2">
          {initialSyndicates.map(s => (
            <button key={s.id} onClick={() => setActiveSyndicateId(s.id)} className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeSyndicateId === s.id ? 'bg-accent-crimson text-white' : 'bg-bg-glass border border-border-glass text-muted-foreground hover:text-foreground'}`}>{s.name}</button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px] sm:h-[700px]">
        {/* Hierarchy Tree */}
        <div className="lg:col-span-3 overflow-auto p-6 sm:p-8 border border-border-glass rounded-3xl bg-bg-glass scrollbar-hide relative">
          <div className="min-w-fit flex justify-center pt-6">
            {hierarchy ? renderNode(hierarchy) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Hierarchy mapping pending for {activeSyndicate?.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Node Dossier Sidebar */}
        <div className={`space-y-4 transition-all duration-300 ${selectedNode ? 'opacity-100' : 'opacity-40'}`}>
          {selectedNode ? (
            <>
              <div className="glass-card p-5 border-border-glass bg-bg-glass h-full flex flex-col">
                <button onClick={() => setSelectedNode(null)} className="self-end text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6">× Close</button>
                <div className="flex-1 space-y-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-bg-glass border border-border-glass rounded text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-3">Node_Type_{selectedNode.type}</div>
                    <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1 text-foreground">{selectedNode.name}</h2>
                    <p className="text-[12px] font-mono text-accent-gold font-bold tracking-[0.3em] uppercase">{selectedNode.role}</p>
                  </div>
                  <div className="p-4 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Intelligence Summary</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic">"{selectedNode.desc || 'No detailed description available for this command level.'}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-4 border-border-glass bg-bg-glass"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Direct Links</p><p className="text-xl font-bold font-mono text-foreground">{selectedNode.children?.length ?? 0}</p></div>
                    <div className="glass-card p-4 border-border-glass bg-bg-glass"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Score</p><p className="text-xl font-bold font-mono text-accent-crimson">{selectedNode.risk}%</p></div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Infiltration Tactics</p>
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-bg-glass rounded-xl border border-border-glass"><Scale className="w-4 h-4 text-accent-blue" /></div>
                      <div className="p-2.5 bg-bg-glass rounded-xl border border-border-glass"><Lock className="w-4 h-4 text-accent-gold" /></div>
                      <div className="p-2.5 bg-bg-glass rounded-xl border border-border-glass"><Zap className="w-4 h-4 text-accent-crimson" /></div>
                    </div>
                  </div>
                </div>
                <button className="mt-auto w-full py-4 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all">Generate Vulnerability Report</button>
              </div>
            </>
          ) : (
            <div className="glass-card p-6 border-border-glass bg-bg-glass h-full flex flex-col items-center justify-center text-center">
              <Users className="w-8 h-8 text-muted-foreground/30 mb-4" />
              <p className="text-[13px] text-muted-foreground font-bold uppercase tracking-widest">Select a node to view dossier</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
