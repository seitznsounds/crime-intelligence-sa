"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  UserX, 
  ShieldAlert, 
  History, 
  Search, 
  Activity, 
  ChevronRight, 
  Skull, 
  Scale, 
  RefreshCw,
  Info
} from "lucide-react";

const PERPETRATORS = [
  { 
    id: "PERP_01", 
    name: "General Magnus M.", 
    role: "Former Minister of Defense", 
    status: "deceased_unpunished", 
    crimes: ["Cross-border Raids", "Civilian Massacres", "Political Assassinations"],
    risk: 10,
    desc: "Oversaw the militarization of apartheid and sanctioned numerous illegal operations against anti-apartheid activists across Southern Africa."
  },
  { 
    id: "PERP_02", 
    name: "Dr. Wouter B.", 
    role: "Project Coast Lead", 
    status: "alive_unpunished", 
    crimes: ["Chemical Warfare", "Bio-Terrorism Programs", "Human Experimentation"],
    risk: 10,
    desc: "Head of the apartheid-era chemical and biological weapons program. Remains unpunished despite overwhelming evidence of crimes against humanity."
  },
  { 
    id: "PERP_03", 
    name: "Eugene de K.", 
    role: "Vlakplaas Commander", 
    status: "alive_punished", 
    crimes: ["Torture", "Abduction", "Extra-judicial Killings"],
    risk: 10,
    desc: "Operated the notorious Vlakplaas death squad. Served 20 years before being granted parole. Identified as 'Prime Evil' in historical archives."
  }
];

const TRC_VOLUMES = [
  { vol: 1, title: "Introductory & Rationale", status: "INDEXED", progress: 100 },
  { vol: 2, title: "Gross Violations (1960-1994)", status: "INDEXING", progress: 68 },
  { vol: 3, title: "Victim Perspectives", status: "QUEUED", progress: 0 },
  { vol: 4, title: "Institutional Hearings", status: "QUEUED", progress: 0 },
  { vol: 5, title: "Conclusions & Findings", status: "QUEUED", progress: 0 },
  { vol: 6, title: "Amnesty & Financials", status: "QUEUED", progress: 0 },
  { vol: 7, title: "Victim Tributes", status: "ACTIVE", progress: 12 },
];


export default function AccountabilityPage() {
  const [selectedPerp, setSelectedPerp] = useState<any>(null);
  const [isBackfilling, setIsBackfilling] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alive_unpunished': return 'text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5';
      case 'alive_punished': return 'text-accent-blue border-accent-blue/20 bg-accent-blue/5';
      case 'deceased_unpunished': return 'text-white/40 border-white/10 bg-white/5';
      case 'deceased_punished': return 'text-white/60 border-white/20 bg-white/10';
      default: return 'text-white/20 border-white/5 bg-white/[0.01]';
    }
  };

  const getStatusLabel = (status: string) => status.replace('_', ' ').toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-accent-crimson/30">
      {/* Cinematic Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ff3b3003,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-crimson/10 rounded-2xl flex items-center justify-center border border-accent-crimson/20 shadow-glow-crimson">
              <UserX className="w-6 h-6 text-accent-crimson" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson font-mono">Crimes Against Humanity Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Accountability Board</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Apify RAG Excavation</p>
              <p className="text-[10px] font-mono font-bold text-accent-blue flex items-center gap-2">
                <Activity className="w-3 h-3" /> ACTIVE_QUERY: "TRC_RECORDS_1996"
              </p>
            </div>
            <button 
              onClick={() => setIsBackfilling(true)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackfilling ? 'animate-spin' : ''}`} /> Trigger Backfill
            </button>
          </div>
        </header>

        {/* Tactical HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Unpunished Assets", value: "242", icon: <ShieldAlert className="w-4 h-4 text-accent-crimson" /> },
            { label: "Pending Backfills", value: "1,204", icon: <RefreshCw className="w-4 h-4 text-accent-blue" /> },
            { label: "Deceased / Unresolved", value: "84", icon: <Skull className="w-4 h-4 text-white/20" /> },
            { label: "Justice Index", value: "12.8%", icon: <Scale className="w-4 h-4 text-accent-gold" /> }
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
          {/* Perpetrator Dossiers */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
              <History className="w-4 h-4" /> Historical Injustice Records
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PERPETRATORS.map((perp, i) => (
                <motion.div 
                  key={perp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedPerp(perp)}
                  className={`glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all relative overflow-hidden group ${selectedPerp?.id === perp.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
                >
                  <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-bold tracking-widest border-l border-b rounded-bl-xl ${getStatusColor(perp.status)}`}>
                    {getStatusLabel(perp.status)}
                  </div>

                  <h4 className="text-2xl font-bold tracking-tighter uppercase mb-1">{perp.name}</h4>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">{perp.role}</p>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Documented Crimes</p>
                    <div className="flex flex-wrap gap-2">
                      {perp.crimes.map((crime, ci) => (
                        <span key={ci} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-white/60">
                          {crime}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <span>Dossier_Link_{perp.id}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deep History Backfill Monitor */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <RefreshCw className={`w-4 h-4 ${isBackfilling ? 'animate-spin' : ''}`} /> TRC_REPORT_VAULT
              </h3>
              <div className="space-y-6">
                {TRC_VOLUMES.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-white/80 uppercase">Vol {item.vol}: {item.title}</span>
                      <span className={`tracking-widest ${item.status === 'INDEXED' ? 'text-accent-blue' : item.status === 'INDEXING' ? 'text-accent-gold animate-pulse' : 'text-white/20'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.status === 'INDEXED' ? 'bg-accent-blue shadow-glow-blue' : item.status === 'INDEXING' ? 'bg-accent-gold shadow-glow-gold' : 'bg-white/10'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <RefreshCw className={`w-4 h-4 ${isBackfilling ? 'animate-spin' : ''}`} /> Backfill Monitor
              </h3>
              <div className="space-y-6">
                {[
                  { query: "Native Land Act 1913", status: "PROCESSING", progress: 62 },
                  { query: "Sharpville Massacre", status: "COMPLETED", progress: 100 },
                  { query: "State Security Council", status: "QUEUED", progress: 0 }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-white/80 uppercase">{item.query}</span>
                      <span className={`tracking-widest ${item.status === 'COMPLETED' ? 'text-accent-blue' : 'text-accent-gold'}`}>{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.status === 'COMPLETED' ? 'bg-accent-blue shadow-glow-blue' : 'bg-accent-gold shadow-glow-gold'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="glass-card p-8 border-accent-crimson/20 bg-accent-crimson/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-4 h-4 text-accent-crimson" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-crimson">Accountability Mandate</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light italic mb-0">
                "To forgive without accountability is to legitimize the crime. Our objective is to ensure that those who perpetrated crimes against humanity are never erased from the collective memory of justice."
              </p>
            </div>
          </div>
        </div>

        {/* Selected Perpetrator Overlay */}
        <AnimatePresence>
          {selectedPerp && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedPerp(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-2xl border-white/10 bg-black p-12 relative shadow-glow-crimson"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedPerp(null)}
                  className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white"
                >
                  Close Dossier [ESC]
                </button>

                <div className="space-y-10">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 border rounded mb-4 ${getStatusColor(selectedPerp.status)}`}>
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase">{getStatusLabel(selectedPerp.status)}</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none">{selectedPerp.name}</h2>
                    <p className="text-lg font-mono text-white/40 uppercase tracking-widest">{selectedPerp.role}</p>
                  </div>

                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <History className="w-4 h-4" /> Operational History
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed font-light italic">
                      "{selectedPerp.desc}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Documented Violations</p>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedPerp.crimes.map((crime: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                          <ShieldAlert className="w-4 h-4 text-accent-crimson" />
                          <span className="text-[10px] font-mono text-white/80 uppercase">{crime}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-5 bg-accent-crimson text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-glow">
                    Generate ICC Evidence Package
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
