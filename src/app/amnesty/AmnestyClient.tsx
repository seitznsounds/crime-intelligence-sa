"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Scale, ShieldAlert, History, Activity, ChevronRight, UserCheck, XCircle, Search, FileText, Filter, CheckCircle2, Heart, UserX } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";

interface AmnestyApp {
  id: string;
  name: string;
  group: string;
  decision: string;
  disclosure: boolean;
  motive: string;
  crime: string;
  hearing: string;
}

const getDecisionColor = (d: string) => ({ granted: 'text-accent-blue border-accent-blue/20 bg-accent-blue/5', refused: 'text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5', partial: 'text-accent-gold border-accent-gold/20 bg-accent-gold/5' }[d] ?? 'text-muted-foreground border-border-glass bg-bg-glass');

export default function AmnestyPage({ initialApplications }: { initialApplications: AmnestyApp[] }) {
  const [selectedApp, setSelectedApp] = useState<AmnestyApp | null>(null);
  const [query, setQuery] = useState("");
  const [applications, setApplications] = useState<AmnestyApp[]>(initialApplications);

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase()) || 
    app.crime.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PageShell
      title="Amnesty Decisions"
      subtitle="Tracking every TRC Amnesty Committee decision. 7,112 applications processed — only 16.4% granted."
      badge="Amnesty Tracker"
      badgeColor="blue"
      icon={<Scale className="w-6 h-6 text-accent-blue" />}
      guidance="This page lists decisions made by the Truth and Reconciliation Commission's Amnesty Committee. You can browse who was granted amnesty, who was denied, and what crimes were involved."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore", href: "/accountability" }, { label: "Amnesty Decisions", href: "/amnesty" }]}
      actions={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search applicant..." 
              className="bg-bg-glass border border-border-glass rounded-xl py-2.5 pl-10 pr-5 text-[12px] text-foreground placeholder:text-muted-foreground/40 focus:border-accent-blue/40 outline-none w-52" 
            />
          </div>
          <button className="p-2.5 bg-bg-glass border border-border-glass rounded-xl hover:bg-bg-glass-heavy transition-all"><Filter className="w-4 h-4 text-muted-foreground" /></button>
        </div>
      }
    >
      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Applications Processed", value: "7,112", icon: <FileText className="w-4 h-4 text-muted-foreground/60" /> },
          { label: "Amnesty Granted", value: "1,167", icon: <UserCheck className="w-4 h-4 text-accent-blue" /> },
          { label: "Amnesty Refused", value: "5,143", icon: <XCircle className="w-4 h-4 text-accent-crimson" /> },
          { label: "Amnesty Rate", value: "16.4%", icon: <Activity className="w-4 h-4 text-accent-gold" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
              {item.icon}
            </div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Scale className="w-4 h-4 text-accent-blue" /> The Amnesty Ledger [Volume 6]</h3>
          {filteredApps.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedApp(app)}
              className={`glass-card p-6 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start gap-6 group ${selectedApp?.id === app.id ? 'border-accent-blue/40 bg-accent-blue/[0.02]' : ''}`}>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold tracking-tighter uppercase text-foreground">{app.name}</h4>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-0.5 border border-border-glass rounded">{app.group}</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-light line-clamp-1 italic">"{app.crime}"</p>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Disclosure</p>
                  <div className={`flex items-center gap-2 text-[12px] font-bold ${app.disclosure ? 'text-accent-blue' : 'text-accent-crimson'}`}>
                    {app.disclosure ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {app.disclosure ? 'FULL' : 'INCOMPLETE'}
                  </div>
                </div>
                <div className={`px-3 py-1.5 border rounded-xl text-[11px] font-bold tracking-[0.2em] uppercase ${getDecisionColor(app.decision)}`}>{app.decision}</div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 transition-all hidden sm:block" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Activity className="w-4 h-4 text-accent-blue" /> Decision Distribution</h3>
            <div className="space-y-5">
              {[{ label: "Refused", value: 5143, progress: 72, color: "bg-accent-crimson" }, { label: "Granted", value: 1167, progress: 16, color: "bg-accent-blue" }, { label: "Partial", value: 802, progress: 12, color: "bg-accent-gold" }].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-muted-foreground uppercase">{item.label}</span>
                    <span className="text-muted-foreground/60 font-mono">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-bg-glass-heavy rounded-full overflow-hidden">
                    <motion.div className={`h-full ${item.color}`} initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 1.5, delay: i * 0.2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/[0.01]">
            <div className="flex items-center gap-3 mb-4"><History className="w-4 h-4 text-accent-blue" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-blue">The Amnesty Mandate</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-6">"Amnesty was granted to those who provided a full disclosure of their acts and proved that they were associated with a political objective."</p>
            <button className="w-full py-3 bg-bg-glass border border-border-glass text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all">Download Volume 6 Dataset</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/90 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-2xl border-border-glass bg-background p-8 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedApp(null)} className="absolute top-6 right-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Close [ESC]</button>
              <div className="space-y-6">
                <div>
                  <div className={`inline-flex items-center gap-2 px-2 py-0.5 border rounded mb-4 ${getDecisionColor(selectedApp.decision)}`}>
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase">AMNESTY_{selectedApp.decision.toUpperCase()}</span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2 text-foreground">{selectedApp.name}</h2>
                  <p className="text-[13px] font-mono text-muted-foreground uppercase">Affiliation: {selectedApp.group}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-5 bg-bg-glass border border-border-glass rounded-2xl">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-accent-crimson" /> Specific Act</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic">"{selectedApp.crime}"</p>
                  </div>
                  <div className="p-5 bg-accent-blue/5 border border-accent-blue/20 rounded-2xl">
                    <p className="text-[11px] font-bold text-accent-blue uppercase tracking-widest mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Political Objective</p>
                    <p className="text-[12px] text-foreground/80 leading-relaxed font-light">{selectedApp.motive}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-bg-glass border border-border-glass rounded-xl">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Disclosure: {selectedApp.hearing}</p>
                  <span className={`text-[12px] font-bold font-mono ${selectedApp.disclosure ? 'text-accent-blue' : 'text-accent-crimson'}`}>{selectedApp.disclosure ? 'CRITERIA_MET' : 'NOT_MET'}</span>
                </div>
                <button className="w-full py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-blue hover:text-white transition-all">Generate Legal Truth Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhatNext suggestions={[
        { title: "Honouring Victims", description: "Read the stories of victims of political violence.", href: "/victims", icon: Heart },
        { title: "Court Rulings", description: "Browse real criminal court judgments.", href: "/justice/judgments", icon: Scale },
        { title: "Unpunished Perpetrators", description: "Track those who committed crimes but were never held accountable.", href: "/accountability", icon: UserX },
      ]} />
    </PageShell>
  );
}
