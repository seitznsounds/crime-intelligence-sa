"use client";

import { motion } from "framer-motion";
import { History, ArrowDown, ExternalLink, Scale, ShieldAlert } from "lucide-react";

interface CaseLifecycleProps {
  incident: any;
  linkedJudgments: any[];
}

export default function CaseLifecycle({ incident, linkedJudgments }: CaseLifecycleProps) {
  if (!linkedJudgments || linkedJudgments.length === 0) return null;

  return (
    <div className="glass-card p-10 border-border-glass bg-bg-glass relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
      
      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold mb-12 flex items-center gap-3">
        <History className="w-4 h-4" /> CASE_LIFECYCLE_RESOLUTION
      </h3>

      <div className="space-y-12 relative">
        {/* Step 1: Street Report */}
        <div className="flex gap-8 group">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-crimson/10 border border-accent-crimson/20 flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-all">
                <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="w-0.5 h-16 bg-gradient-to-b from-accent-crimson/30 to-accent-gold/30 mt-4" />
          </div>
          <div className="flex-1 pt-1">
            <span className="text-[9px] font-black text-accent-crimson uppercase tracking-widest block mb-2">Phase 1: Field Intelligence</span>
            <h4 className="text-lg font-bold leading-tight mb-2">{incident.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{incident.summary}"</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                <span className="px-2 py-0.5 bg-white/5 rounded">INCIDENT_ID: {incident.id.substring(0, 8)}</span>
                <span>•</span>
                <span>{new Date(incident.occurred_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Judicial Outcome */}
        {linkedJudgments.map((j, idx) => (
          <div key={j.id} className="flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue group-hover:text-white transition-all">
                  <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pt-1">
              <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest block mb-2">Phase 2: Judicial Ruling</span>
              <h4 className="text-lg font-bold leading-tight mb-2">{j.title}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                  {j.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 bg-accent-blue/5 border border-accent-blue/10 rounded text-[8px] font-black uppercase text-accent-blue/80 tracking-widest">{tag}</span>
                  ))}
              </div>
              <a 
                href={`/justice/judgments/${j.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-2 border border-border-glass rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue hover:bg-accent-blue hover:text-white transition-all"
              >
                Examine Judgment <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
