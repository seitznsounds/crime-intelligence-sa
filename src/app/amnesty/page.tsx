"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Scale, 
  ShieldAlert, 
  History, 
  Activity, 
  ChevronRight, 
  UserCheck, 
  XCircle, 
  Search, 
  FileText,
  Filter,
  CheckCircle2
} from "lucide-react";

const AMNESTY_APPS = [
  { 
    id: "APP_01", 
    name: "Eugene de Kock", 
    group: "SAPS / Vlakplaas", 
    decision: "partial", 
    disclosure: true,
    motive: "Suppression of anti-apartheid activists and protection of state security.",
    crime: "Multiple counts of murder, abduction, and torture including the Motherwell bombing.",
    hearing: "Pretoria, 1997-1998"
  },
  { 
    id: "APP_02", 
    name: "Clive Derby-Lewis", 
    group: "Conservative Party", 
    decision: "refused", 
    disclosure: false,
    motive: "Triggering a racial civil war to prevent the 1994 elections.",
    crime: "Assassination of Chris Hani in April 1993.",
    hearing: "Johannesburg, 1997"
  },
  { 
    id: "APP_03", 
    name: "Janusz Waluś", 
    group: "Conservative Party", 
    decision: "refused", 
    disclosure: false,
    motive: "Triggering a racial civil war to prevent the 1994 elections.",
    crime: "Assassination of Chris Hani in April 1993.",
    hearing: "Johannesburg, 1997"
  }
];

export default function AmnestyPage() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string>("ALL");

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'granted': return 'text-accent-blue border-accent-blue/20 bg-accent-blue/5';
      case 'refused': return 'text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5';
      case 'partial': return 'text-accent-gold border-accent-gold/20 bg-accent-gold/5';
      default: return 'text-white/20 border-white/5 bg-white/[0.01]';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-accent-blue/30">
      {/* Forensic Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#007aff03,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center border border-accent-blue/20 shadow-glow-blue">
              <Scale className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-blue/5 border border-accent-blue/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-blue font-mono">TRC Phase 5: Amnesty Tracking Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Amnesty Tracker</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="SEARCH_APPLICANT..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-6 text-[10px] font-mono text-white placeholder:text-white/10 focus:border-accent-blue/40 outline-none transition-all w-64"
                />
             </div>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4 text-white/40" />
             </button>
          </div>
        </header>

        {/* Amnesty HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Applications Processed", value: "7,112", icon: <FileText className="w-4 h-4 text-white/20" /> },
            { label: "Amnesty Granted", value: "1,167", icon: <UserCheck className="w-4 h-4 text-accent-blue" /> },
            { label: "Amnesty Refused", value: "5,143", icon: <XCircle className="w-4 h-4 text-accent-crimson" /> },
            { label: "Amnesty Rate", value: "16.4%", icon: <Activity className="w-4 h-4 text-accent-gold" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Amnesty Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
              <Scale className="w-4 h-4 text-accent-blue" /> The Amnesty Ledger [Volume 6]
            </h3>
            
            <div className="space-y-4">
              {AMNESTY_APPS.map((app, i) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedApp(app)}
                  className={`glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group ${selectedApp?.id === app.id ? 'border-accent-blue/40 bg-accent-blue/[0.02]' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                       <h4 className="text-xl font-bold tracking-tighter uppercase">{app.name}</h4>
                       <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest px-2 py-0.5 border border-white/5 rounded">{app.group}</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-light line-clamp-1 italic">
                      "{app.crime}"
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1 text-right">Disclosure</p>
                        <div className={`flex items-center gap-2 text-[10px] font-bold font-mono ${app.disclosure ? 'text-accent-blue' : 'text-accent-crimson'}`}>
                           {app.disclosure ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                           {app.disclosure ? 'FULL' : 'INCOMPLETE'}
                        </div>
                     </div>
                     <div className={`px-4 py-2 border rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${getDecisionColor(app.decision)}`}>
                        {app.decision}
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decision Matrix & Stats */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <Activity className="w-4 h-4 text-accent-blue" /> Decision Distribution
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Refused (Incomplete Disclosure)", value: 5143, progress: 72, color: "bg-accent-crimson" },
                  { label: "Granted (Full Disclosure)", value: 1167, progress: 16, color: "bg-accent-blue" },
                  { label: "Withdrawn / Partial", value: 802, progress: 12, color: "bg-accent-gold" }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-white/60 uppercase">{item.label}</span>
                      <span className="text-white/20 font-mono">{item.value}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <History className="w-4 h-4 text-accent-blue" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">The Amnesty Mandate</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light italic mb-8">
                "Amnesty was granted to those who provided a full disclosure of their acts and proved that they were associated with a political objective. To track these decisions is to track the legal truth of the conflict."
              </p>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all">
                Download Volume 6 Dataset [JSONL]
              </button>
            </div>
          </div>
        </div>

        {/* Selected Application Overlay */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedApp(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-2xl border-white/10 bg-black p-12 relative shadow-glow-blue"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white"
                >
                  Close Record [ESC]
                </button>

                <div className="space-y-10">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 border rounded mb-4 ${getDecisionColor(selectedApp.decision)}`}>
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase">AMNESTY_{selectedApp.decision.toUpperCase()}</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none">{selectedApp.name}</h2>
                    <p className="text-lg font-mono text-white/40 uppercase tracking-widest">Affiliation: {selectedApp.group}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                       <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-accent-crimson" /> Specific Act Documented
                          </p>
                          <p className="text-sm text-white/60 leading-relaxed font-light italic">
                            "{selectedApp.crime}"
                          </p>
                       </div>
                       <div className="glass-card p-6 border-white/5">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Hearing Location</p>
                          <p className="text-xl font-bold font-mono tracking-tighter">{selectedApp.hearing}</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="p-8 bg-accent-blue/5 border border-accent-blue/20 rounded-3xl">
                          <p className="text-[10px] font-bold text-accent-blue uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Political Objective Analysis
                          </p>
                          <p className="text-xs text-white/80 leading-relaxed font-light font-mono uppercase tracking-tight">
                            {selectedApp.motive}
                          </p>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Full Disclosure Criteria</p>
                          <div className={`text-[10px] font-bold font-mono ${selectedApp.disclosure ? 'text-accent-blue' : 'text-accent-crimson'}`}>
                             {selectedApp.disclosure ? 'MET' : 'NOT_MET'}
                          </div>
                       </div>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-blue hover:text-white transition-all shadow-glow">
                    Generate Legal Truth Report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
