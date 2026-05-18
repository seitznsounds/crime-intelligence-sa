"use client";

import { motion } from "framer-motion";
import { Network, User, Briefcase, Gavel, ArrowRight } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: 'Person' | 'Organization' | 'Event' | 'Entity';
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

interface RelationshipGraphProps {
  nodes: Node[];
  edges: Edge[];
  title?: string;
}

export default function RelationshipGraph({ nodes, edges, title = "Intelligence Links" }: RelationshipGraphProps) {
  return (
    <div className="glass-card p-8 border-border-glass bg-bg-glass overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Network className="w-12 h-12 text-accent-blue" />
      </div>

      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-2">
        <Network className="w-4 h-4 text-accent-blue" /> {title}
      </h3>

      <div className="relative min-h-[300px] flex flex-wrap justify-center items-center gap-12 py-10">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative z-10 flex flex-col items-center group"
          >
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
              node.type === 'Person' ? 'border-accent-blue/30 bg-accent-blue/5 text-accent-blue group-hover:bg-accent-blue group-hover:text-white' :
              node.type === 'Organization' ? 'border-accent-gold/30 bg-accent-gold/5 text-accent-gold group-hover:bg-accent-gold group-hover:text-black' :
              'border-white/20 bg-white/5 text-muted-foreground group-hover:bg-white group-hover:text-black'
            }`}>
              {node.type === 'Person' ? <User className="w-6 h-6" /> : 
               node.type === 'Organization' ? <Briefcase className="w-6 h-6" /> : 
               <Gavel className="w-6 h-6" />}
            </div>
            <span className="mt-3 text-[10px] font-black uppercase tracking-tight text-center max-w-[100px] leading-tight line-clamp-2">
              {node.name}
            </span>
            <span className="text-[8px] font-mono uppercase text-muted-foreground opacity-60">{node.type}</span>
          </motion.div>
        ))}

        {/* Simplified Edge Visualization */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           {/* In a production app, we would use a library like D3 or React Flow here */}
           {/* For this prototype, we use the aesthetic of a connected network */}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border-glass flex justify-between items-center">
        <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" /> Person
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" /> Organization
            </div>
        </div>
        <button className="text-[9px] font-black uppercase tracking-widest text-accent-blue flex items-center gap-1 hover:underline">
            Deep Link Analysis <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
