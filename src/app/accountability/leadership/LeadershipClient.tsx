"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Network, ShieldAlert, Users, GitCommit, FileWarning } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { FullScreenDataModal } from "@/components/ui/FullScreenDataModal";

interface Node {
  id: string;
  role: string;
  name: string;
  riskLevel: string;
  score: number;
  x: number;
  y: number;
  description: string;
}

interface Link {
  source: string;
  target: string;
}

export default function LeadershipClient({ data }: { data: { stats: any, nodes: Node[], links: Link[] } }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get coordinates for SVG lines
  const getNodeCoords = (id: string) => {
    const node = data.nodes.find(n => n.id === id);
    // Offset by roughly half the card width/height to center the lines
    // Standard card width ~220px, height ~100px
    return node ? { x: node.x + 110, y: node.y + 50 } : { x: 0, y: 0 };
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'var(--accent-crimson)';
      case 'medium': return 'var(--accent-gold)';
      default: return 'var(--accent-blue)';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'high': return 'bg-accent-crimson/5 border-accent-crimson/30 shadow-[0_0_30px_rgba(255,59,48,0.15)]';
      case 'medium': return 'bg-accent-gold/5 border-accent-gold/30';
      default: return 'bg-bg-glass border-border-glass';
    }
  };

  return (
    <PageShell
      title="National Leadership Audit"
      subtitle="Visualizing the systemic flow of corruption and compromised nodes across government structures."
      badge="Tier-1 Audit"
      badgeColor="crimson"
      icon={<Network className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Accountability", href: "/accountability" },
        { label: "Leadership Mapping", href: "/accountability/leadership" }
      ]}
    >
      {/* HUD Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
        <div className="glass-card p-6 border-border-glass bg-bg-glass relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24 text-muted-foreground" />
          </div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Audited Departments</span>
            <Network className="w-4 h-4 text-accent-blue" />
          </div>
          <p className="text-4xl font-black tracking-tighter text-foreground">{data.stats.auditedDepartments}</p>
        </div>

        <div className="glass-card p-6 border-accent-crimson/30 bg-accent-crimson/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-24 h-24 text-accent-crimson" />
          </div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Compromise Index</span>
            <ShieldAlert className="w-4 h-4 text-accent-crimson" />
          </div>
          <p className="text-4xl font-black tracking-tighter text-accent-crimson">{data.stats.compromiseIndex}%</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-2 font-medium">Nodes flagged with severe audit irregularities</p>
        </div>
      </div>

      {/* Interactive Org Chart Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-[600px] sm:h-[800px] glass-card border-border-glass bg-[#050505] relative overflow-hidden rounded-3xl touch-none"
      >
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-background/80 backdrop-blur-md rounded border border-border-glass text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5" /> Drag to Pan Canvas
        </div>

        <motion.div 
          drag 
          dragConstraints={containerRef}
          dragElastic={0.2}
          className="w-[2000px] h-[1500px] absolute cursor-grab active:cursor-grabbing"
          initial={{ x: -150, y: -20 }} // Start slightly panned on mobile
        >
          {/* SVG Connecting Lines (Rendered Behind) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {data.links.map((link, idx) => {
              const source = getNodeCoords(link.source);
              const target = getNodeCoords(link.target);
              const targetNode = data.nodes.find(n => n.id === link.target);
              const isHighRisk = targetNode?.riskLevel === 'high';

              // Curve logic
              const midY = (source.y + target.y) / 2;
              const path = `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;

              return (
                <path 
                  key={idx}
                  d={path}
                  fill="none"
                  stroke={isHighRisk ? "var(--accent-crimson)" : "var(--accent-blue)"}
                  strokeWidth="2"
                  strokeOpacity={isHighRisk ? "0.6" : "0.3"}
                  className={isHighRisk ? "animate-pulse" : ""}
                />
              );
            })}
          </svg>

          {/* HTML Nodes (Rendered Above) */}
          {data.nodes.map((node) => (
            <div 
              key={node.id} 
              className="absolute z-10"
              style={{ left: node.x, top: node.y }}
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag conflict when tapping
            >
              <FullScreenDataModal
                title={node.role}
                description={node.name}
                trigger={
                  <div className={`w-[220px] p-4 rounded-xl backdrop-blur-xl border cursor-pointer transition-all hover:scale-105 ${getRiskBg(node.riskLevel)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{node.id}</span>
                      {node.riskLevel === 'high' && <div className="w-2 h-2 rounded-full bg-accent-crimson animate-pulse shadow-glow-crimson" />}
                    </div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight text-foreground leading-tight mb-1">{node.role}</h3>
                    <p className="text-[11px] uppercase text-muted-foreground font-medium truncate">{node.name}</p>
                    
                    <div className="mt-3 pt-3 border-t border-border-glass flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Forensic Score</span>
                      <span className="text-[12px] font-mono font-bold" style={{ color: getRiskColor(node.riskLevel) }}>{node.score}%</span>
                    </div>
                  </div>
                }
              >
                {/* Dossier Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center border ${getRiskBg(node.riskLevel)}`}>
                      <Users className="w-8 h-8 opacity-50" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-foreground">{node.name}</h4>
                      <p className="text-[12px] font-mono text-muted-foreground uppercase">{node.role}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileWarning className="w-4 h-4" /> Audit Summary
                    </p>
                    <p className="text-sm text-foreground leading-relaxed font-medium italic">"{node.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 border-border-glass bg-bg-glass">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Level</p>
                      <p className="text-[14px] font-black uppercase tracking-tight" style={{ color: getRiskColor(node.riskLevel) }}>
                        {node.riskLevel}
                      </p>
                    </div>
                    <div className="glass-card p-5 border-border-glass bg-bg-glass">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Forensic Score</p>
                      <p className="text-[14px] font-mono font-bold text-foreground">{node.score}/100</p>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-4 bg-foreground text-background rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-accent-crimson hover:text-white transition-all shadow-button-inset">
                    Export Full Forensic Dossier
                  </button>
                </div>
              </FullScreenDataModal>
            </div>
          ))}
        </motion.div>
      </div>
    </PageShell>
  );
}
