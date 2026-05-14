"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Building2, ShieldAlert, History, Activity, ChevronRight, Scale, FileText, AlertTriangle, Zap } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

interface Audit {
  id: string;
  name: string;
  sector: string;
  decay: number;
  status: string;
  violations: string[];
  echo: string;
  desc: string;
}

const getDecayColor = (d: number) => d >= 8 ? 'text-accent-crimson' : d >= 5 ? 'text-accent-gold' : 'text-accent-blue';
const getDecayBg = (d: number) => d >= 8 ? 'bg-accent-crimson' : d >= 5 ? 'bg-accent-gold' : 'bg-accent-blue';

export default function AuditsPage({ initialAudits }: { initialAudits: Audit[] }) {
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [audits, setAudits] = useState<Audit[]>(initialAudits);

  if (audits.length === 0) {
    return (
      <PageShell
        title="Institutional Audits"
        subtitle="Forensic accountability hearings from TRC Volume 4. Tracking the historical decay of South Africa's core institutions."
        badge="TRC Phase 5: Institutional Audit Sector"
        badgeColor="crimson"
        icon={<Building2 className="w-6 h-6 text-accent-crimson" />}
      >
        <div className="flex flex-col items-center justify-center h-[400px] glass-card border-border-glass bg-bg-glass">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">No Audit Data Available</h3>
          <p className="text-muted-foreground">The intelligence database currently contains no verified institutional audits.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Institutional Audits"
      subtitle="Forensic accountability hearings from TRC Volume 4. Tracking the historical decay of South Africa's core institutions."
      badge="TRC Phase 5: Institutional Audit Sector"
      badgeColor="crimson"
      icon={<Building2 className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Data", href: "/stats" }, { label: "Institutional Audits", href: "/audits" }]}
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Institutions Audited", value: "24", icon: <FileText className="w-4 h-4 text-muted-foreground/60" /> },
          { label: "Critical Decay Points", value: "112", icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" /> },
          { label: "Reform Resistance", value: "High", icon: <Activity className="w-4 h-4 text-accent-gold" /> },
          { label: "Justice Compliance", value: "32%", icon: <Scale className="w-4 h-4 text-accent-blue" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3"><span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>{item.icon}</div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><FileText className="w-4 h-4 text-accent-crimson" /> Forensic Audit Dossiers</h3>
          {audits.map((audit, i) => (
            <motion.div key={audit.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedAudit(audit)}
              className={`glass-card p-6 sm:p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy cursor-pointer transition-all relative overflow-hidden group ${selectedAudit?.id === audit.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase mb-1 block">Sector: {audit.sector}</span>
                  <h4 className="text-xl sm:text-2xl font-bold tracking-tighter uppercase text-foreground">{audit.name}</h4>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Decay_Index</p>
                  <p className={`text-4xl font-bold font-mono tracking-tighter ${getDecayColor(audit.decay)}`}>{audit.decay}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2"><History className="w-3.5 h-3.5" /> Historical Findings</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-light line-clamp-3">{audit.desc}</p>
                </div>
                <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                  <div className="absolute top-0 right-0 p-2 text-accent-gold opacity-10"><Zap className="w-8 h-8" /></div>
                  <p className="text-[11px] font-bold text-accent-gold uppercase tracking-widest mb-3">Modern Systemic Echo</p>
                  <p className="text-[12px] text-muted-foreground leading-relaxed italic">"{audit.echo}"</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border-glass pt-5">
                <span className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-accent-crimson" /> {audit.violations.length} Core Violations Indexed</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Activity className="w-4 h-4 text-accent-crimson" /> Injustice Decay Matrix</h3>
            <div className="space-y-6">
              {audits.slice(0, 5).map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase">
                    <span className="text-muted-foreground truncate max-w-[150px]">{item.name}</span>
                    <span className={getDecayColor(item.decay)}>{item.decay >= 8 ? 'CRITICAL' : item.decay >= 5 ? 'SEVERE' : 'MODERATE'}</span>
                  </div>
                  <div className="h-1.5 bg-bg-glass-heavy rounded-full overflow-hidden">
                    <motion.div className={`h-full ${getDecayBg(item.decay)}`} initial={{ width: 0 }} animate={{ width: `${item.decay * 10}%` }} transition={{ duration: 1.5, delay: i * 0.2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.01]">
            <div className="flex items-center gap-3 mb-4"><Scale className="w-4 h-4 text-accent-crimson" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-crimson">Institutional Accountability</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-5">"The TRC Volume 4 institutional hearings were designed to explore the broader environment in which violations took place."</p>
            <button className="w-full py-3 bg-bg-glass border border-border-glass text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-crimson hover:text-white transition-all">Download Full Sector Report [PDF]</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAudit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/90 backdrop-blur-sm" onClick={() => setSelectedAudit(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-3xl border-border-glass bg-background p-8 relative shadow-glow overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedAudit(null)} className="absolute top-6 right-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Close [ESC]</button>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-4"><span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent-crimson">VOL_4_INSTITUTIONAL_HEARING</span></div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase mb-2 text-foreground">{selectedAudit.name}</h2>
                    <p className="text-[13px] font-mono text-muted-foreground uppercase">Sector: {selectedAudit.sector}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Decay_Rank</p>
                    <p className={`text-5xl font-bold font-mono tracking-tighter ${getDecayColor(selectedAudit.decay)}`}>{selectedAudit.decay}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><History className="w-4 h-4" /> Historical Role</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic">"{selectedAudit.desc}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAudit.violations.map((v, i) => (<span key={i} className="px-3 py-1 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[11px] font-mono text-accent-crimson">{v}</span>))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-5 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl">
                      <p className="text-[11px] font-bold text-accent-gold uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> Modern Relevance</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed font-light">{selectedAudit.echo}</p>
                    </div>
                    <button className="w-full py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all">Initiate Forensic Counter-Audit</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
