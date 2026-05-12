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
import PageShell from "@/components/layout/PageShell";

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
    <PageShell
      title="Citizen Voting"
      subtitle="Democratic prioritization of investigation targets. Your vote directs investigative resources toward the corruption points that matter most."
      badge="Democratic Prioritization Hub"
      badgeColor="gold"
      icon={<VoteIcon className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Act", href: "/vote" },
        { label: "Citizen Voting", href: "/vote" },
      ]}
    >
      {/* Governance HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {[
          { label: "Active Proposals", value: "14", icon: <Activity className="w-4 h-4 text-accent-blue" /> },
          { label: "Verified Voters", value: "24,801", icon: <Users className="w-4 h-4 text-accent-gold" /> },
          { label: "Consensus Average", value: "72.4%", icon: <TrendingUp className="w-4 h-4 text-muted-foreground" /> },
          { label: "Next Hatch Est.", value: "48H", icon: <Zap className="w-4 h-4 text-accent-crimson" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
              {item.icon}
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Active Proposals List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">High-Priority Investigation Targets</h3>
          
          {PROPOSALS.map((prop, i) => (
            <motion.div 
              key={prop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group overflow-hidden relative"
            >
              {/* Consensus Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-accent-gold/10 w-full" />
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-accent-gold"
                initial={{ width: 0 }}
                animate={{ width: `${votedIds.includes(prop.id) ? prop.consensus + 1 : prop.consensus}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-mono text-muted-foreground tracking-wide uppercase">{prop.id}</span>
                    <span className="px-2 py-0.5 rounded border border-border-glass text-[11px] font-bold tracking-wide uppercase text-muted-foreground">
                      {prop.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase mb-3 text-foreground">{prop.target}</h4>
                  <p className="text-[14px] text-muted-foreground leading-relaxed font-light mb-6">{prop.desc}</p>
                  
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Support</p>
                        <p className="text-[13px] font-mono font-bold text-foreground">{prop.votes.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-accent-crimson" />
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Risk</p>
                        <p className="text-[13px] font-mono font-bold text-accent-crimson">{prop.risk}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-4 shrink-0 w-full sm:w-auto">
                  <div className="sm:text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-gold mb-1">Consensus</p>
                    <p className="text-4xl sm:text-5xl font-bold tracking-tighter text-accent-gold">{prop.consensus}%</p>
                  </div>
                  <button 
                    onClick={() => handleVote(prop.id)}
                    disabled={votedIds.includes(prop.id)}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all ${votedIds.includes(prop.id) ? 'bg-bg-glass-heavy text-muted-foreground border border-border-glass' : 'bg-accent-gold text-background hover:scale-105'}`}
                  >
                    {votedIds.includes(prop.id) ? "SUPPORTED" : "SUPPORT VOTE"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Governance Rules & Insights */}
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass backdrop-blur-xl">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
              <Globe className="w-4 h-4" /> Global Hatch Log
            </h3>
            <div className="space-y-5">
              {[
                { target: "Cape Town Port Audit", status: "HATCHED", date: "2H AGO" },
                { target: "Station 401 Investigation", status: "VERIFYING", date: "4H AGO" },
                { target: "Tender Fraud Network", status: "ACTIVE", date: "12H AGO" }
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border-glass">
                  <div>
                    <p className="text-[13px] font-bold uppercase tracking-tight mb-0.5 text-foreground">{log.target}</p>
                    <p className="text-[11px] font-mono text-muted-foreground uppercase">{log.date}</p>
                  </div>
                  <span className={`text-[11px] font-bold tracking-wide uppercase ${log.status === 'HATCHED' ? 'text-accent-blue' : 'text-accent-gold'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 border-accent-gold/20 bg-accent-gold/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-accent-gold" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent-gold">Governance Integrity</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-6">
              "Citizen Voting ensures that investigative resources are directed toward the corruption points that matter most to the community."
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Consensus Mining...
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
