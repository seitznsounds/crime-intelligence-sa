"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, ShieldAlert, Activity, GitCommit, Network, FileWarning, EyeOff, HeartPulse, AlertTriangle, Clock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import DataTabs from "@/components/ui/DataTabs";
import { FullScreenDataModal } from "@/components/ui/FullScreenDataModal";
import { MobileExpandableChart } from "@/components/ui/MobileExpandableChart";
import { ResponsiveDataGrid } from "@/components/ui/ResponsiveDataGrid";

export default function AssassinationsClient({ metrics, events, wpuData }: { metrics: any, events: any[], wpuData: any }) {
  const [activeTab, setActiveTab] = useState("timeline");

  const TABS = [
    { id: "timeline", label: "Chronological Sequence", count: events.length },
    { id: "network", label: "Relational Network" },
    { id: "wpu", label: "WPU Health" }
  ];

  return (
    <PageShell
      title="Assassinations & Retribution"
      subtitle="Visualizing the Protection-Implementation Paradox and the failure of the Witness Protection Unit."
      badge="PPLAAF Intelligence"
      badgeColor="crimson"
      icon={<Skull className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Accountability", href: "/accountability" },
        { label: "Assassinations", href: "/accountability/assassinations" }
      ]}
    >
      {/* HUD Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="glass-card p-6 border-accent-crimson/30 bg-accent-crimson/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-24 h-24 text-accent-crimson" />
          </div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Physical Impunity Rate</span>
            <ShieldAlert className="w-4 h-4 text-accent-crimson" />
          </div>
          <p className="text-4xl font-black tracking-tighter text-accent-crimson">{metrics.impunityRate}%</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3 font-medium">Of masterminds remain unprosecuted</p>
        </div>

        <div className="glass-card p-6 border-border-glass bg-bg-glass relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <Skull className="w-24 h-24 text-muted-foreground" />
          </div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Recorded Hits</span>
            <Activity className="w-4 h-4 text-accent-gold" />
          </div>
          <p className="text-4xl font-black tracking-tighter text-foreground">{metrics.totalHits}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3 font-medium">Verified Whistleblower Assassinations</p>
        </div>

        <div className="glass-card p-6 border-border-glass bg-bg-glass relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Protection Paradox</span>
            <EyeOff className="w-4 h-4 text-accent-blue" />
          </div>
          <p className="text-4xl font-black tracking-tighter text-accent-blue">{metrics.protectionFailure}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3 font-medium">Failure rate of formal protection requests</p>
        </div>
      </div>

      <DataTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl space-y-6 relative"
            >
              {/* Timeline Track */}
              <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-4 w-[2px] bg-border-glass" />
              
              {events.map((evt, idx) => (
                <FullScreenDataModal
                  key={evt.id}
                  title={evt.victim_name}
                  description={`${evt.date} | ${evt.event_type.toUpperCase()}`}
                  trigger={
                    <div className="relative pl-16 sm:pl-20 group cursor-pointer touch-manipulation">
                      <div className={`absolute left-5 sm:left-[27px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-background z-10 transition-transform group-hover:scale-125
                        ${evt.event_type === 'retaliation' ? 'bg-accent-crimson' : 'bg-accent-blue'}
                      `} />
                      <div className={`glass-card p-5 sm:p-6 border transition-all duration-300
                        ${evt.event_type === 'retaliation' 
                          ? 'border-accent-crimson/20 bg-accent-crimson/5 hover:border-accent-crimson/50' 
                          : 'border-border-glass bg-bg-glass hover:bg-bg-glass-heavy'
                        }
                      `}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            {evt.event_type === 'retaliation' ? <Skull className="w-3.5 h-3.5 text-accent-crimson" /> : <FileWarning className="w-3.5 h-3.5 text-accent-blue" />}
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${evt.event_type === 'retaliation' ? 'text-accent-crimson' : 'text-accent-blue'}`}>
                              {evt.event_type}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{evt.date}</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter mb-1 uppercase">{evt.victim_name}</h4>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-4">{evt.role}</p>
                        <p className="text-[13px] text-foreground leading-relaxed font-light">{evt.description}</p>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-6">
                    <div className="p-6 bg-bg-glass border border-border-glass rounded-2xl">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                        <GitCommit className="w-4 h-4" /> Sequence Extract
                      </p>
                      <p className="text-sm text-foreground leading-relaxed font-medium italic">"{evt.description}"</p>
                    </div>
                    
                    {evt.implicated_pep && (
                      <div className="p-5 bg-accent-crimson/5 border border-accent-crimson/20 rounded-xl">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-accent-crimson mb-2">Implicated PEP / Syndicate</h5>
                        <p className="text-lg font-black text-foreground uppercase tracking-tight">{evt.implicated_pep}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-5 border-border-glass bg-bg-glass">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Status</p>
                        <p className="text-[14px] font-black uppercase tracking-tight text-accent-crimson">Unprosecuted</p>
                      </div>
                      <div className="glass-card p-5 border-border-glass bg-bg-glass">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Protection State</p>
                        <p className="text-[14px] font-black uppercase tracking-tight text-accent-blue">Denied / Failed</p>
                      </div>
                    </div>
                  </div>
                </FullScreenDataModal>
              ))}
            </motion.div>
          )}

          {activeTab === "network" && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MobileExpandableChart
                title="Retaliation Network Graph"
                description="Relational mapping between whistleblowers and implicated entities."
              >
                <div className="glass-card h-[500px] sm:h-[700px] border-border-glass bg-bg-glass-heavy relative overflow-hidden flex items-center justify-center p-4">
                  {/* Mock SVG Network Graph */}
                  <svg viewBox="0 0 1000 600" className="w-full h-full">
                    {/* Edges */}
                    <line x1="300" y1="200" x2="500" y2="300" stroke="var(--accent-crimson)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4" className="animate-pulse" />
                    <line x1="300" y1="400" x2="500" y2="300" stroke="var(--accent-blue)" strokeWidth="1.5" strokeOpacity="0.3" />
                    <line x1="500" y1="300" x2="700" y2="250" stroke="var(--accent-crimson)" strokeWidth="3" strokeOpacity="0.5" />
                    <line x1="500" y1="300" x2="750" y2="400" stroke="var(--accent-crimson)" strokeWidth="2" strokeOpacity="0.3" />
                    
                    {/* Nodes */}
                    <g className="cursor-pointer hover:opacity-80 transition-opacity">
                      <circle cx="300" cy="200" r="30" fill="var(--bg-glass-heavy)" stroke="var(--accent-crimson)" strokeWidth="2" />
                      <text x="300" y="250" fill="var(--foreground)" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest font-mono">B. Deokaran</text>
                      <text x="300" y="265" fill="var(--muted-foreground)" fontSize="10" textAnchor="middle" className="uppercase">Whistleblower</text>
                    </g>

                    <g className="cursor-pointer hover:opacity-80 transition-opacity">
                      <circle cx="300" cy="400" r="30" fill="var(--bg-glass-heavy)" stroke="var(--accent-blue)" strokeWidth="2" />
                      <text x="300" y="450" fill="var(--foreground)" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest font-mono">C. Murray</text>
                      <text x="300" y="465" fill="var(--muted-foreground)" fontSize="10" textAnchor="middle" className="uppercase">Investigator</text>
                    </g>

                    <g className="cursor-pointer hover:opacity-80 transition-opacity group">
                      <circle cx="500" cy="300" r="50" fill="var(--accent-crimson)" fillOpacity="0.1" stroke="var(--accent-crimson)" strokeWidth="4" className="animate-pulse" />
                      <text x="500" y="295" fill="var(--accent-crimson)" fontSize="14" fontWeight="900" textAnchor="middle" className="uppercase tracking-widest">Provincial</text>
                      <text x="500" y="315" fill="var(--accent-crimson)" fontSize="14" fontWeight="900" textAnchor="middle" className="uppercase tracking-widest">Syndicate</text>
                    </g>

                    <g className="cursor-pointer hover:opacity-80 transition-opacity">
                      <circle cx="700" cy="250" r="40" fill="var(--bg-glass-heavy)" stroke="var(--accent-gold)" strokeWidth="2" />
                      <text x="700" y="245" fill="var(--foreground)" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest font-mono">State Capture</text>
                      <text x="700" y="260" fill="var(--foreground)" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest font-mono">Architects</text>
                    </g>

                    <g className="cursor-pointer hover:opacity-80 transition-opacity">
                      <circle cx="750" cy="400" r="35" fill="var(--bg-glass-heavy)" stroke="var(--accent-gold)" strokeWidth="2" />
                      <text x="750" y="455" fill="var(--foreground)" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest font-mono">Bosasa</text>
                      <text x="750" y="470" fill="var(--muted-foreground)" fontSize="10" textAnchor="middle" className="uppercase">Cartel Node</text>
                    </g>
                  </svg>
                  
                  <div className="absolute top-6 left-6 flex items-center gap-4 bg-background/80 backdrop-blur-md p-3 rounded-xl border border-border-glass pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Disclosure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-crimson" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retaliation</span>
                    </div>
                  </div>
                </div>
              </MobileExpandableChart>
            </motion.div>
          )}

          {activeTab === "wpu" && (
            <motion.div
              key="wpu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Causality Banner */}
              <div className="glass-card p-6 sm:p-8 bg-accent-crimson/10 border border-accent-crimson/30 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-16 h-16 rounded-full bg-accent-crimson/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-8 h-8 text-accent-crimson" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-accent-crimson mb-2">Institutional Sabotage Detected</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Forensic analysis indicates a direct causal link between the 75% unspent WPU operational budget and the 98% physical impunity rate of whistleblower assassinations. 
                  </p>
                </div>
              </div>

              {/* Budget Hemorrhage Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass-card p-8 border-border-glass bg-bg-glass">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">WPU Budget Utilization</p>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-3xl font-black font-mono tracking-tighter text-accent-crimson">{wpuData.stats.budgetSpent}</span>
                      <span className="text-[11px] font-bold text-muted-foreground ml-2">Spent</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold font-mono text-foreground">{wpuData.stats.budgetAllocated}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">Allocated</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-bg-glass-heavy rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent-crimson shadow-[0_0_15px_rgba(255,59,48,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: "24.8%" }} // 112/450
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-accent-crimson mt-4 font-bold text-right">75.2% Diverted or Unspent</p>
                </div>

                <div className="glass-card p-8 border-border-glass bg-bg-glass">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Safehouse Operational Capacity</p>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-3xl font-black font-mono tracking-tighter text-accent-gold">{wpuData.stats.safehousesActive}</span>
                      <span className="text-[11px] font-bold text-muted-foreground ml-2">Active</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold font-mono text-foreground">{wpuData.stats.safehousesRequired}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">Required</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-bg-glass-heavy rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent-gold shadow-[0_0_15px_rgba(255,186,8,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: "14%" }} // 12/85
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-accent-gold mt-4 font-bold text-right">86% Deficit in Protection Nodes</p>
                </div>
              </div>

              {/* Critical Vacancy Roster */}
              <div className="glass-card p-6 sm:p-10 border-border-glass bg-bg-glass w-full overflow-hidden">
                <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-8">Critical Vacancy Roster</h3>
                <ResponsiveDataGrid 
                  data={wpuData.vacancies}
                  keyExtractor={(v) => v.id}
                  columns={[
                    {
                      header: "Role",
                      accessorKey: "role",
                      mobilePriority: "primary",
                      cell: (v: any) => (
                        <span className="text-foreground font-bold text-[14px]">{v.role}</span>
                      )
                    },
                    {
                      header: "Department",
                      accessorKey: "department",
                      mobilePriority: "secondary",
                      cell: (v: any) => (
                        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">{v.department}</span>
                      )
                    },
                    {
                      header: "Duration",
                      accessorKey: "monthsVacant",
                      mobilePriority: "secondary",
                      cell: (v: any) => (
                        <div className="flex items-center gap-2">
                          <Clock className={`w-3 h-3 ${v.monthsVacant >= 12 ? 'text-accent-crimson animate-pulse' : 'text-accent-gold'}`} />
                          <span className={`text-[12px] font-black font-mono ${v.monthsVacant >= 12 ? 'text-accent-crimson' : 'text-accent-gold'}`}>
                            {v.monthsVacant} MO
                          </span>
                        </div>
                      )
                    },
                    {
                      header: "Risk Status",
                      accessorKey: "risk",
                      mobilePriority: "hidden",
                      cell: (v: any) => (
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border ${v.risk === 'CRITICAL' ? 'text-accent-crimson border-accent-crimson/30 bg-accent-crimson/10' : 'text-accent-gold border-accent-gold/30 bg-accent-gold/10'}`}>
                          {v.risk}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
