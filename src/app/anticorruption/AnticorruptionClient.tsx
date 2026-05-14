"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ShieldAlert, TrendingUp, Eye, EyeOff, Users, Building2,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, Scale,
  Megaphone, Lock, FileText, BarChart3, Landmark, Calculator, ArrowRight, Info, Award, Globe, Quote
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import IncentiveCalculator from "@/components/incentive-calculator/IncentiveCalculator";
import SapsInfiltrationHub from "@/components/intel/SapsInfiltrationHub";
import AccountabilityDashboard from "@/components/intel/AccountabilityDashboard";
import OPITransitionTracker from "@/components/intel/OPITransitionTracker";
import OversightRadar from "@/components/intel/OversightRadar";
import WpuTracker from "@/components/intel/WpuTracker";
import Link from "next/link";
import DataTabs from "@/components/ui/DataTabs";
import ForensicInfo from "@/components/ui/ForensicInfo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReportingMetric {
  label: string;
  value: number;
  color: string;
  suffix: string;
}

interface SocialNormMetric {
  label: string;
  value: number;
  icon?: React.ReactNode;
  type: string;
}

interface ZondoPillar {
  id: number;
  title: string;
  status: string;
  priority: string;
}

interface LegislativeGap {
  law: string;
  gap: string;
  severity: string;
  fix: string;
}

interface AnticorruptionClientProps {
  reportingMetrics: ReportingMetric[];
  socialNormMetrics: SocialNormMetric[];
  zondoPillars: ZondoPillar[];
  legislativeGaps: LegislativeGap[];
  oversightMetrics: any[];
  reformData: any[];
  accountabilityKpis: any;
  wpuData: any;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricBar({ label, value, color, suffix }: { label: string; value: number; color: string; suffix: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-charcoal-40">{label}</span>
        <span className="text-sm font-bold font-mono text-accent-blue">{value}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-charcoal-3 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color} opacity-80`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function PillarStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    enacted:     { label: "ENACTED",     cls: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5", icon: <CheckCircle2 className="w-3 h-3" /> },
    in_progress: { label: "IN PROGRESS", cls: "text-accent-gold border-accent-gold/20 bg-accent-gold/5", icon: <Clock className="w-3 h-3" /> },
    proposed:    { label: "PROPOSED",    cls: "text-charcoal-40 border-charcoal-40/20 bg-charcoal-3",    icon: <ChevronRight className="w-3 h-3" /> },
  };
  const { label, cls, icon } = map[status] ?? map.proposed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-black tracking-widest ${cls}`}>
      {icon}{label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5",
    high:     "text-accent-gold border-accent-gold/20 bg-accent-gold/5",
    medium:   "text-charcoal-40 border-charcoal-40/20 bg-charcoal-3",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 border rounded-full text-[9px] font-black tracking-widest uppercase ${map[severity] ?? map.medium}`}>
      {severity}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnticorruptionClient({
  reportingMetrics,
  socialNormMetrics,
  zondoPillars,
  legislativeGaps,
  oversightMetrics,
  reformData,
  accountabilityKpis,
  wpuData
}: AnticorruptionClientProps) {
  const [activeTab, setActiveTab] = useState("sentiment");
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const enacted = zondoPillars.filter(p => p.status === "enacted").length;

  const TABS = [
    { id: "sentiment", label: "Public Sentiment" },
    { id: "reforms", label: "Reform Tracker", count: enacted },
    { id: "legal", label: "Legislative Audit" },
    { id: "calculator", label: "Incentive Calc" }
  ];

  return (
    <PageShell
      title="Anti-Corruption Intelligence Hub"
      subtitle="Cross-referencing NACAC 2025, HSRC Social Norms, Mthente Literature Review & National Dialogue findings."
      badge="Policy Intelligence — Sprint 5"
      badgeColor="gold"
      icon={<Scale className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Intelligence", href: "/anticorruption" },
        { label: "Anti-Corruption Hub", href: "/anticorruption" },
      ]}
    >
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {[
          { label: "Economic Impact", value: "R1.5T",    sub: "Annual corruption cost", icon: <BarChart3 className="w-5 h-5 text-accent-crimson" /> },
          { label: "Reporting Void",  value: "11%",      sub: "Aware but won't testify",  icon: <EyeOff className="w-5 h-5 text-accent-gold" /> },
          { label: "Fear Multiplier", value: "62%",      sub: "Fear retaliation if reporting",     icon: <Lock className="w-5 h-5 text-accent-crimson" /> },
          { label: "Zondo Progress",  value: `${enacted}/${zondoPillars.length}`, sub: "Pillars enacted into law",       icon: <Scale className="w-5 h-5 text-accent-blue" /> },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-8 bg-background border-border"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal-40">{kpi.label}</span>
              {kpi.icon}
            </div>
            <p className="text-4xl font-black tracking-tight text-charcoal mb-2 font-mono">{kpi.value}</p>
            <p className="text-[11px] text-charcoal-83 font-medium uppercase tracking-widest">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <DataTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[600px]"
        >
          {activeTab === "sentiment" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
              <div className="lg:col-span-2 space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-8 border-border-glass bg-bg-glass"
                >
                  <div className="flex items-center gap-3 mb-2 text-nowrap">
                    <Eye className="w-4 h-4 text-accent-gold" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                      The Reporting Void
                      <ForensicInfo 
                        title="Reporting Void" 
                        content="The delta between citizens who experience corruption and those who formally report it."
                        source="HSRC Social Norms 2025"
                      />
                    </h2>
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-8 leading-relaxed">
                    Despite widespread awareness, a structural 15% gap exists between citizens who recognise corruption's impact and those willing to report it. Fear of retaliation (62%) is the primary suppressor.
                  </p>
                  <div className="space-y-5">
                    {reportingMetrics.map((m, i) => (
                      <MetricBar key={i} {...m} />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-8 border-border-glass bg-bg-glass"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-4 h-4 text-accent-blue" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                      Social Norms Index
                      <ForensicInfo 
                        title="Social Norms" 
                        content="Quantified behavioral patterns identifying corruption normalization."
                        source="GIZ-HSRC 2025"
                      />
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialNormMetrics.map((m, i) => (
                      <div key={i} className="p-4 bg-bg-glass border border-border-glass rounded-xl text-nowrap overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            {m.type === 'negative' ? <AlertTriangle className="w-4 h-4 text-accent-crimson" /> : 
                             m.type === 'positive' ? <ShieldAlert className="w-4 h-4 text-emerald-400" /> :
                             <Scale className="w-4 h-4 text-slate-400" />}
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[120px]">{m.label}</span>
                          </div>
                          <span className="text-lg font-bold font-mono text-foreground">{m.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-white/20 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }} viewport={{ once: true }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="space-y-6">
                <OversightRadar initialMetrics={oversightMetrics} />
              </div>
            </div>
          )}

          {activeTab === "reforms" && (
            <div className="space-y-16">
              <AccountabilityDashboard initialKpis={accountabilityKpis} initialReforms={reformData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <OPITransitionTracker />
                {wpuData && <WpuTracker data={wpuData} />}
              </div>
              
              <section className="mb-16 pb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-accent-gold/30" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold flex items-center gap-2">
                    Zondo Reform Tracker
                    <ForensicInfo title="Zondo Pillars" content="10 critical institutional and legislative reforms." source="Zondo Vol 6" />
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {zondoPillars.map((pillar, i) => (
                    <div key={pillar.id} className="glass-card p-5 border-border-glass bg-bg-glass">
                      <p className="text-[11px] font-semibold text-foreground/90 mb-4">{pillar.title}</p>
                      <PillarStatus status={pillar.status} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "legal" && (
            <div className="space-y-20 pb-20">
              <SapsInfiltrationHub />
              
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-accent-crimson/30" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-crimson">Legislative Loophole Matrix</h2>
                </div>
                <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-glass">
                          {["Act / Law", "Identified Gap", "Severity", "Proposed Fix"].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-glass text-nowrap">
                        {legislativeGaps.map((gap, i) => (
                          <tr key={i} className="hover:bg-bg-glass-heavy transition-colors text-[11px]">
                            <td className="px-6 py-4 font-mono font-bold text-foreground/80">{gap.law}</td>
                            <td className="px-6 py-4 text-muted-foreground max-w-xs whitespace-normal">{gap.gap}</td>
                            <td className="px-6 py-4"><SeverityBadge severity={gap.severity} /></td>
                            <td className="px-6 py-4 text-foreground/70 whitespace-normal">{gap.fix}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="pb-20">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 space-y-3 px-4 uppercase tracking-wider font-bold">
                  <h3 className="text-2xl text-foreground italic">Restitution Engine</h3>
                  <p className="text-[11px] text-muted-foreground">High-premium modeling based on Zondo recommendations.</p>
                </div>
                <IncentiveCalculator />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <section className="border-t border-white/5 pt-20 pb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-[1px] bg-accent-blue/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-blue">Intelligence Source Mapping</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "NACAC Final Report", year: "2025", type: "Forensic Policy", focus: "OPI Transition" },
            { name: "HSRC Social Norms", year: "2025", type: "Citizen Survey", focus: "Reporting Void" },
            { name: "Zondo Vol 6", year: "2022", type: "Commission Findings", focus: "Reform Requirements" },
            { name: "PPLAAF Audit", year: "2023", type: "Legal Analysis", focus: "PDA Deficiencies" },
            { name: "StatsSA GPSJS", year: "2019", type: "Victimology", focus: "4.9x Home Robbery Discrepancy" }
          ].map((src, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-accent-blue/30 transition-all">
              <div className="flex justify-between items-start mb-4 text-nowrap">
                <span className="text-[10px] font-mono text-accent-blue font-bold">{src.year}</span>
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-white/40">{src.type}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2 group-hover:text-white transition-colors">{src.name}</h4>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed whitespace-normal truncate">Focus Node: {src.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-20">
        {[
          { label: "Report Corruption", sub: "Anonymous secure uplink", href: "/report", icon: <Megaphone className="w-5 h-5 text-accent-crimson" />, border: "border-accent-crimson/30" },
          { label: "Expose Board", sub: "View PEP dossiers", href: "/expose", icon: <ShieldAlert className="w-5 h-5 text-accent-gold" />, border: "border-accent-gold/30" },
          { label: "Network Map", sub: "Corruption link graph", href: "/network", icon: <Building2 className="w-5 h-5 text-accent-blue" />, border: "border-accent-blue/30" },
        ].map((cta, i) => (
          <Link key={i} href={cta.href}>
            <div className={`glass-card p-6 border ${cta.border} bg-bg-glass hover:bg-bg-glass-heavy cursor-pointer transition-all group flex items-center gap-4`}>
              {cta.icon}
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-white transition-colors">{cta.label}</p>
                <p className="text-[10px] text-muted-foreground whitespace-normal">{cta.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </motion.div>
    </PageShell>
  );
}
