"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Users, 
  Target, 
  Vote as VoteIcon, 
  Activity, 
  ChevronRight, 
  ShieldAlert, 
  TrendingUp,
  Award,
  Zap,
  Globe
} from "lucide-react";

const PROPOSALS = [
  { 
    id: "PROP_772", 
    target: "The Waterfront Syndicate", 
    type: "ORGANIZED_CRIME", 
    consensus: 84, 
    votes: 12402, 
    risk: 92,
    desc: "Uncovering the link between port logistics and high-level customs officials."
  },
  { 
    id: "PROP_401", 
    target: "Department of Procurement Hub", 
    type: "GOVERNMENT_ENTITY", 
    consensus: 91, 
    votes: 8203, 
    risk: 88,
    desc: "Auditing preferential tender allocations for SAPS vehicle maintenance."
  },
  { 
    id: "PROP_219", 
    target: "Lt. Colonel B. Mokoena", 
    type: "INDIVIDUAL_PEP", 
    consensus: 62, 
    votes: 3102, 
    risk: 95,
    desc: "Investigating systemic docket disappearances linked to transit hijackings."
  }
];

export default function VotePage() {
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const handleVote = (id: string) => {
    if (!votedIds.includes(id)) {
      setVotedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-accent-gold/30">
      {/* Cinematic Governance Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#d4af3705,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-2xl flex items-center justify-center border border-accent-gold/20">
              <VoteIcon className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-gold/5 border border-accent-gold/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-gold">Democratic Prioritization Hub</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Citizen Voting</h1>
            </div>
          </div>
        </header>

        {/* Governance HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Active Proposals", value: "14", icon: <Activity className="w-4 h-4 text-accent-blue" /> },
            { label: "Verified Voters", value: "24,801", icon: <Users className="w-4 h-4 text-accent-gold" /> },
            { label: "Consensus Average", value: "72.4%", icon: <TrendingUp className="w-4 h-4 text-white/20" /> },
            { label: "Next Hatch Est.", value: "48H", icon: <Zap className="w-4 h-4 text-accent-crimson" /> }
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
          {/* Active Proposals List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8">High-Priority Investigation Targets</h3>
            
            {PROPOSALS.map((prop, i) => (
              <motion.div 
                key={prop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden relative"
              >
                {/* Consensus Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1 bg-accent-gold/10 w-full" />
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-accent-gold shadow-glow-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${votedIds.includes(prop.id) ? prop.consensus + 1 : prop.consensus}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />

                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">ID: {prop.id}</span>
                      <span className="px-2 py-0.5 rounded border border-white/10 text-[8px] font-bold tracking-widest uppercase text-white/40">
                        {prop.type}
                      </span>
                    </div>
                    <h4 className="text-3xl font-bold tracking-tighter uppercase mb-4">{prop.target}</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-light mb-8">{prop.desc}</p>
                    
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-white/20" />
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Support</p>
                          <p className="text-xs font-mono font-bold">{prop.votes.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-accent-crimson" />
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Risk Level</p>
                          <p className="text-xs font-mono font-bold text-accent-crimson">{prop.risk}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-6 shrink-0">
                    <div className="text-center md:text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-gold mb-1">Consensus</p>
                      <p className="text-5xl font-bold tracking-tighter text-accent-gold">{prop.consensus}%</p>
                    </div>
                    <button 
                      onClick={() => handleVote(prop.id)}
                      disabled={votedIds.includes(prop.id)}
                      className={`w-full md:w-auto px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${votedIds.includes(prop.id) ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-accent-gold text-black hover:scale-105 shadow-glow-gold'}`}
                    >
                      {votedIds.includes(prop.id) ? "SUPPORTED" : "SUPPORT_VOTE"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Governance Rules & Insights */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
                <Globe className="w-4 h-4" /> Global Hatch Log
              </h3>
              <div className="space-y-6">
                {[
                  { target: "Cape Town Port Audit", status: "HATCHED", date: "2H AGO" },
                  { target: "Station 401 Investigation", status: "VERIFYING", date: "4H AGO" },
                  { target: "Tender Fraud Network", status: "ACTIVE", date: "12H AGO" }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-tight mb-0.5">{log.target}</p>
                      <p className="text-[8px] font-mono text-white/20 uppercase">{log.date}</p>
                    </div>
                    <span className={`text-[8px] font-bold tracking-widest uppercase ${log.status === 'HATCHED' ? 'text-accent-blue' : 'text-accent-gold'}`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-accent-gold/20 bg-accent-gold/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-accent-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Governance Integrity</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light italic mb-8">
                "Citizen Voting ensures that investigative resources are directed toward the corruption points that matter most to the community. Radical transparency is a democratic collective."
              </p>
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Consensus Mining...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
