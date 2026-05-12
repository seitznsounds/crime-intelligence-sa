"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Building2, 
  ShieldAlert, 
  History, 
  Activity, 
  ChevronRight, 
  Scale, 
  Search, 
  FileText,
  AlertTriangle,
  Zap
} from "lucide-react";

const AUDITS = [
  { 
    id: "AUDIT_01", 
    name: "SAPS (South African Police Service)", 
    sector: "security", 
    decay: 9.2, 
    status: "unreformed", 
    violations: ["Systemic Torture", "Vlakplaas Death Squads", "Impunity Culture"],
    echo: "Modern police brutality and the 'docket disappearance' phenomenon are direct cultural descendants of the SAP's operational methods documented in Volume 4.",
    desc: "The TRC found that the police were the primary instruments of state-sponsored terror. The failure to root out the 'impunity culture' has led to the current crisis in law enforcement."
  },
  { 
    id: "AUDIT_02", 
    name: "SADF (South African Defence Force)", 
    sector: "security", 
    decay: 8.4, 
    status: "unreformed", 
    violations: ["Cross-border Terrorism", "Surveillance", "Militarization"],
    echo: "The secretive nature of SADF operations provided a blueprint for modern-day opaque procurement and intelligence overreach.",
    desc: "Heavily involved in destabilizing Southern Africa. Volume 4 details the total militarization of the apartheid state and its lasting impact on regional security."
  },
  { 
    id: "AUDIT_03", 
    name: "Department of Justice", 
    sector: "judiciary", 
    decay: 6.1, 
    status: "partially_reformed", 
    violations: ["Judicial Negligence", "Legalized Discrimination"],
    echo: "The historical failure to protect citizens' rights has created a judiciary that is often perceived as sluggish in tackling political corruption.",
    desc: "The legal hearings explored how the judiciary largely upheld discriminatory laws and failed to intervene in cases of gross human rights violations."
  }
];

export default function AuditsPage() {
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  const getDecayColor = (decay: number) => {
    if (decay >= 8) return 'text-accent-crimson';
    if (decay >= 5) return 'text-accent-gold';
    return 'text-accent-blue';
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-crimson/30 transition-colors duration-300">
      {/* Forensic Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-crimson-opacity),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-crimson/10 rounded-2xl flex items-center justify-center border border-accent-crimson/20 shadow-glow-crimson">
              <Building2 className="w-6 h-6 text-accent-crimson" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson font-mono">TRC Phase 5: Institutional Audit Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase text-foreground">Institutional Audits</h1>
            </div>
          </div>
        </header>

        {/* Audit HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Institutions Audited", value: "24", icon: <Search className="w-4 h-4 text-muted-foreground/40" /> },
            { label: "Critical Decay Points", value: "112", icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" /> },
            { label: "Reform Resistance", value: "High", icon: <Activity className="w-4 h-4 text-accent-gold" /> },
            { label: "Justice Compliance", value: "32%", icon: <Scale className="w-4 h-4 text-accent-blue" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Audit Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
              <FileText className="w-4 h-4 text-accent-crimson" /> Forensic Audit Dossiers
            </h3>
            
            <div className="space-y-6">
              {AUDITS.map((audit, i) => (
                <motion.div 
                  key={audit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedAudit(audit)}
                  className={`glass-card p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-bright cursor-pointer transition-all relative overflow-hidden group ${selectedAudit?.id === audit.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                      <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mb-1 block">Sector: {audit.sector}</span>
                      <h4 className="text-2xl font-bold tracking-tighter uppercase text-foreground">{audit.name}</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 text-right">Decay_Index</p>
                       <p className={`text-4xl font-bold font-mono tracking-tighter ${getDecayColor(audit.decay)}`}>{audit.decay}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History className="w-3.5 h-3.5" /> Historical Findings [Vol 4]
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed font-light line-clamp-3">
                        {audit.desc}
                      </p>
                    </div>
                    <div className="p-6 bg-bg-glass border border-border-glass rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 text-accent-gold opacity-10">
                          <Zap className="w-8 h-8" />
                       </div>
                       <p className="text-[9px] font-bold text-accent-gold uppercase tracking-widest mb-3">Modern Systemic Echo</p>
                       <p className="text-[10px] text-foreground/60 leading-relaxed italic">
                         "{audit.echo}"
                       </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border-glass pt-6">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="w-3 h-3 text-accent-crimson" /> {audit.violations.length} Core Violations Indexed
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Institutional Integrity HUD */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-border-glass bg-bg-glass backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                <Activity className="w-4 h-4 text-accent-crimson" /> Injustice Decay Matrix
              </h3>
              <div className="space-y-8">
                {[
                  { label: "SAPS Culture", decay: 9.2, status: "CRITICAL" },
                  { label: "SADF Opaque Ops", decay: 8.4, status: "SEVERE" },
                  { label: "Judicial Sluggishness", decay: 6.1, status: "MODERATE" }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                      <span className="text-muted-foreground/60">{item.label}</span>
                      <span className={getDecayColor(item.decay)}>{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-bg-glass-heavy rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${getDecayColor(item.decay).replace('text-', 'bg-')}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.decay * 10}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-accent-crimson/20 bg-accent-crimson/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-4 h-4 text-accent-crimson" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-crimson">Institutional Accountability</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light italic mb-8">
                "The TRC Volume 4 institutional hearings were designed to explore the broader environment in which violations took place. To ignore these findings is to allow the root causes of systemic decay to persist."
              </p>
              <button className="w-full py-4 bg-bg-glass border border-border-glass text-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-crimson hover:text-white transition-all">
                Download Full Sector Report [PDF]
              </button>
            </div>
          </div>
        </div>

        {/* Audit Deep Dive Overlay */}
        <AnimatePresence>
          {selectedAudit && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedAudit(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-3xl border-border-glass bg-background p-12 relative shadow-glow-crimson"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedAudit(null)}
                  className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Close Audit [ESC]
                </button>

                <div className="space-y-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-4">
                        <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">VOL_4_INSTITUTIONAL_HEARING</span>
                      </div>
                      <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none text-foreground">{selectedAudit.name}</h2>
                      <p className="text-lg font-mono text-muted-foreground uppercase tracking-widest">Sector: {selectedAudit.sector}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Decay_Rank</p>
                       <p className={`text-6xl font-bold font-mono tracking-tighter ${getDecayColor(selectedAudit.decay)}`}>{selectedAudit.decay}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="p-8 bg-bg-glass border border-border-glass rounded-3xl">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                            <History className="w-4 h-4" /> Historical Role
                          </p>
                          <p className="text-sm text-foreground/60 leading-relaxed font-light italic">
                            "{selectedAudit.desc}"
                          </p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core Violations Documented</p>
                          <div className="flex flex-wrap gap-2">
                             {selectedAudit.violations.map((v: string, i: number) => (
                               <span key={i} className="px-3 py-1 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[10px] font-mono text-accent-crimson">
                                 {v}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="p-8 bg-accent-gold/5 border border-accent-gold/20 rounded-3xl">
                          <p className="text-[10px] font-bold text-accent-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Modern Relevance Analysis
                          </p>
                          <p className="text-sm text-foreground/80 leading-relaxed font-light font-mono uppercase tracking-tight">
                            {selectedAudit.echo}
                          </p>
                       </div>
                       <button className="w-full py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all shadow-glow">
                         Initiate Forensic Counter-Audit
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
