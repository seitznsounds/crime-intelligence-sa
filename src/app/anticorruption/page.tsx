"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ShieldAlert, TrendingUp, Eye, EyeOff, Users, Building2,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, Scale,
  Megaphone, Lock, Unlock, FileText, BarChart3, Landmark, Calculator, ArrowRight
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import IncentiveCalculator from "@/components/incentive-calculator/IncentiveCalculator";
import SapsInfiltrationHub from "@/components/intel/SapsInfiltrationHub";
import AccountabilityDashboard from "@/components/intel/AccountabilityDashboard";
import OPITransitionTracker from "@/components/intel/OPITransitionTracker";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const REPORTING_METRICS = [
  { label: "Public Willingness to Report", value: 46, color: "bg-emerald-500", suffix: "%" },
  { label: "Willingness to Testify", value: 48, color: "bg-accent-blue", suffix: "%" },
  { label: "Fear of Community Revenge", value: 62, color: "bg-accent-crimson", suffix: "%" },
  { label: "Perceived Elite Impunity", value: 54, color: "bg-accent-gold", suffix: "%" },
];

const SOCIAL_NORM_METRICS = [
  { label: "Bribe Solicitation Exposure", value: 51, icon: <AlertTriangle className="w-4 h-4 text-accent-crimson" /> },
  { label: "Perceived Reporting Ineffectiveness", value: 61, icon: <Clock className="w-4 h-4 text-accent-gold" /> },
  { label: "Sextortion Indirect Exposure", value: 41, icon: <EyeOff className="w-4 h-4 text-accent-crimson" /> },
  { label: "Belief Ordinary People Get Punished", value: 46, icon: <Scale className="w-4 h-4 text-slate-400" /> },
  { label: "Elite Impunity Index", value: 54, icon: <Landmark className="w-4 h-4 text-accent-gold" /> },
  { label: "Zero Tolerance Stance", value: 27, icon: <ShieldAlert className="w-4 h-4 text-emerald-400" /> },
];

const ZONDO_PILLARS = [
  { id: 1, title: "National Anti-Corruption Charter", status: "proposed", priority: "high" },
  { id: 2, title: "Whistleblower Financial Rewards", status: "proposed", priority: "critical" },
  { id: 3, title: "Dedicated Procurement Agency (OPI)", status: "in_progress", priority: "critical" },
  { id: 4, title: "Corporate Deferred Prosecution", status: "proposed", priority: "medium" },
  { id: 5, title: "Procurement Officers Professional Body", status: "in_progress", priority: "high" },
  { id: 6, title: "Public Procurement Transparency", status: "enacted", priority: "high" },
  { id: 7, title: "Accounting Officer Protection (Good Faith)", status: "proposed", priority: "medium" },
  { id: 8, title: "PRECCA Hardening", status: "in_progress", priority: "high" },
  { id: 9, title: "Criminalise Tender-for-Donation", status: "proposed", priority: "critical" },
  { id: 10, title: "Specific Procurement Legislation", status: "enacted", priority: "high" },
];

const LEGISLATIVE_GAPS = [
  { law: "PDA (Protected Disclosures Act)", gap: "Reactive vs Proactive: Only covers 'occupational detriment' after harm occurs.", severity: "critical", fix: "Introduce immediate interim relief & protection orders" },
  { law: "PDA (Protected Disclosures Act)", gap: "The 'Secret' Loophole: Zero protection for disclosures involving State Secrets (PIA 1982).", severity: "critical", fix: "Repeal PIA 1982; integrate security disclosures into PDA" },
  { law: "PDA (Protected Disclosures Act)", gap: "No protection against 'External Harm' (Blacklisting, SLAPP suits, family threats).", severity: "critical", fix: "Broaden scope to include non-occupational retaliation" },
  { law: "PDA (Protected Disclosures Act)", gap: "Reverse Onus Deficit: Burden of proof remains largely on the whistleblower.", severity: "high", fix: "Implement full reverse onus for all detrimental acts" },
  { law: "Witness Protection Act", gap: "Managed by NPA but governed by DOJCD — bureaucratic friction.", severity: "high", fix: "Consolidate into an independent Whistleblower Agency" },
  { law: "Environmental Acts (NEMA)", gap: "Asymmetry: High rewards for env crimes vs zero for state capture.", severity: "medium", fix: "Standardise 15-25% rewards across all corruption types" },
];

const OPI_ARCHITECTURE = [
  { role: "Constitutional Status", detail: "Chapter 9 Body — independent from executive interference", icon: <Landmark className="w-4 h-4 text-accent-gold" /> },
  { role: "Mandate", detail: "Absorb SIU with binding audit recovery powers", icon: <Scale className="w-4 h-4 text-accent-blue" /> },
  { role: "Whistleblower Hub", detail: "Centralised intake, triage and protection coordination", icon: <Megaphone className="w-4 h-4 text-emerald-400" /> },
  { role: "Procurement Oversight", detail: "Anti-corruption agency for state procurement", icon: <FileText className="w-4 h-4 text-accent-crimson" /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricBar({ label, value, color, suffix }: { label: string; value: number; color: string; suffix: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-sm font-bold font-mono text-foreground">{value}{suffix}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
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
    enacted:     { label: "ENACTED",     cls: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: <CheckCircle2 className="w-3 h-3" /> },
    in_progress: { label: "IN PROGRESS", cls: "text-accent-gold border-accent-gold/30 bg-accent-gold/10", icon: <Clock className="w-3 h-3" /> },
    proposed:    { label: "PROPOSED",    cls: "text-slate-400 border-slate-500/30 bg-white/5",           icon: <ChevronRight className="w-3 h-3" /> },
  };
  const { label, cls, icon } = map[status] ?? map.proposed;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-[8px] font-bold tracking-widest ${cls}`}>
      {icon}{label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "text-accent-crimson border-accent-crimson/30 bg-accent-crimson/10",
    high:     "text-accent-gold border-accent-gold/30 bg-accent-gold/10",
    medium:   "text-slate-400 border-slate-500/30 bg-white/5",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 border rounded text-[8px] font-bold tracking-widest uppercase ${map[severity] ?? map.medium}`}>
      {severity}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnticorruptionPage() {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const enacted = ZONDO_PILLARS.filter(p => p.status === "enacted").length;
  const inProgress = ZONDO_PILLARS.filter(p => p.status === "in_progress").length;
  const proposed = ZONDO_PILLARS.filter(p => p.status === "proposed").length;

  return (
    <PageShell
      title="Anti-Corruption Intelligence Hub"
      subtitle="Cross-referencing NACAC 2025, HSRC Social Norms, Mthente Literature Review & National Dialogue findings to expose systemic reform gaps."
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {[
          { label: "Economic Impact", value: "R1.5T",    sub: "Annual corruption cost (NACAC 2025)", icon: <BarChart3 className="w-4 h-4 text-accent-crimson" />, accent: "crimson" },
          { label: "Reporting Void",  value: "15%",      sub: "Aware but won't report (4.9x local gap)",  icon: <EyeOff className="w-4 h-4 text-accent-gold" />,    accent: "gold" },
          { label: "Fear Multiplier", value: "62%",      sub: "Fear retaliation if they report",     icon: <Lock className="w-4 h-4 text-accent-crimson" />,   accent: "crimson" },
          { label: "Zondo Progress",  value: `${enacted}/10`, sub: "Pillars enacted into law",       icon: <Scale className="w-4 h-4 text-emerald-400" />,     accent: "blue" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 border-border-glass bg-bg-glass"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
              {kpi.icon}
            </div>
            <p className="text-3xl font-bold tracking-tighter text-foreground mb-1">{kpi.value}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Accountability Dashboard ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <AccountabilityDashboard />
      </motion.section>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">

        {/* ── Left: Reporting Void Analysis ── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Reporting Void */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 border-border-glass bg-bg-glass"
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-4 h-4 text-accent-gold" />
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">The Reporting Void — HSRC 2025</h2>
            </div>
            <p className="text-[12px] text-muted-foreground mb-8 leading-relaxed">
              Despite widespread awareness, a structural 15% gap exists between citizens who recognise corruption's impact and those willing to report it. Fear of retaliation (62%) is the primary suppressor.
            </p>
            <div className="space-y-5">
              {REPORTING_METRICS.map((m, i) => (
                <MetricBar key={i} {...m} />
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl border border-accent-crimson/20 bg-accent-crimson/[0.03]">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-accent-crimson font-bold">Critical Finding:</span> The 10-point reporting willingness increase (36%→46%) since 2023 is offset by the 62% fear rate. Unless whistleblower protection becomes credible and visible, reporting will stall below the majority threshold.
              </p>
            </div>
          </motion.div>

          {/* Social Norms Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 border-border-glass bg-bg-glass"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-4 h-4 text-accent-blue" />
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Social Norms Index — HSRC 2025</h2>
            </div>
            <p className="text-[12px] text-muted-foreground mb-8 leading-relaxed">
              Survey of 3,095 adults reveals the depth of corruption normalisation — from procurement nepotism to sextortion and codes of silence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIAL_NORM_METRICS.map((m, i) => (
                <div key={i} className="p-4 bg-bg-glass border border-border-glass rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">{m.icon}<span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{m.label}</span></div>
                    <span className="text-lg font-bold font-mono text-foreground">{m.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/20 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: OPI Architecture + Key Source Tags ── */}
        <div className="space-y-6">

          {/* OPI Transition Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <OPITransitionTracker />
          </motion.div>

          {/* Intelligence Sources */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6 border-border-glass bg-bg-glass"
          >
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Intelligence Sources</h3>
            <div className="space-y-3">
              {[
                { name: "NACAC Report 2025", type: "Policy", color: "text-accent-gold", href: "#" },
                { name: "National Dialogue 2024", type: "Strategy", color: "text-accent-blue", href: "#" },
                { name: "HSRC-GIZ Social Norms 2025", type: "Research", color: "text-emerald-400", href: "#" },
                { name: "Mthente Literature Review", type: "Academic", color: "text-slate-300", href: "#" },
                { name: "PPLAAF WB Regime Audit", type: "Legal", color: "text-accent-crimson", href: "#" },
              ].map((src, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] py-2 border-b border-border-glass last:border-0">
                  <span className={`font-bold ${src.color}`}>{src.name}</span>
                  <span className="text-muted-foreground font-mono">{src.type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SAPS Infiltration Hub ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <SapsInfiltrationHub />
      </motion.section>

      {/* ── Zondo Reform Tracker ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent-gold/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold">Zondo Reform Tracker — 10 Pillars</h2>
        </div>
        <div className="flex gap-6 mb-6 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-emerald-400">{enacted} Enacted</span>
          <span className="text-accent-gold">{inProgress} In Progress</span>
          <span className="text-slate-400">{proposed} Proposed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ZONDO_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
              className={`glass-card p-5 border-border-glass bg-bg-glass cursor-pointer transition-all relative ${activePillar === pillar.id ? "border-accent-gold/40 bg-accent-gold/[0.03]" : "hover:bg-bg-glass-heavy"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-mono text-muted-foreground">#{pillar.id.toString().padStart(2, "0")}</span>
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${pillar.priority === "critical" ? "bg-accent-crimson/20 text-accent-crimson" : pillar.priority === "high" ? "bg-accent-gold/20 text-accent-gold" : "bg-white/5 text-slate-400"}`}>
                  {pillar.priority}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-foreground/90 mb-4 leading-snug">{pillar.title}</p>
              <PillarStatus status={pillar.status} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Legislative Loophole Matrix ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent-crimson/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-crimson">Legislative Loophole Matrix</h2>
        </div>
        <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-glass">
                  {["Act / Law", "Identified Gap", "Severity", "Proposed Fix"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEGISLATIVE_GAPS.map((gap, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="border-b border-border-glass last:border-0 hover:bg-bg-glass-heavy transition-colors"
                  >
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-foreground/80">{gap.law}</td>
                    <td className="px-6 py-4 text-[11px] text-muted-foreground max-w-xs">{gap.gap}</td>
                    <td className="px-6 py-4"><SeverityBadge severity={gap.severity} /></td>
                    <td className="px-6 py-4 text-[11px] text-foreground/70">{gap.fix}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ── PDA Forensic Audit Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-accent-crimson/30" />
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-crimson">PDA Forensic Audit — PPLAAF 2023</h2>
          </div>
          <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Scale className="w-24 h-24 text-accent-crimson" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tighter mb-4 text-foreground">The "Execution" of Justice</h3>
              <p className="text-[12px] text-muted-foreground mb-8 leading-relaxed">
                Analysis of 33 precedent-setting whistleblower cases reveals a systematic legal bias against the discloser. The PDA's reliance on the Labour Relations Act (LRA) creates a "Cost of Justice" that most citizens cannot survive.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-accent-crimson/10 border border-accent-crimson/20">
                  <p className="text-3xl font-bold text-accent-crimson mb-1">75.7%</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Case Loss Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border-glass">
                  <p className="text-3xl font-bold text-foreground mb-1">2-4Y</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Avg. Litigation Time</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Cost Orders Against WB", value: "4 Cases", detail: "Whistleblowers forced to pay state legal fees." },
                  { label: "Interim Relief Success", value: "33%", detail: "Only 2 of 6 urgent stay-of-execution requests granted." },
                  { label: "Total Successful Claims", value: "7 / 33", detail: "Majority lost on 'merit' or 'procedural' grounds." },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start py-3 border-b border-border-glass last:border-0">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-accent-gold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.02] mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-blue mb-4">Structural Kill-Switches Identified</h4>
            <ul className="space-y-4">
              {[
                { title: "Employer-First Trap", desc: "Forcing reports through the perpetrator's own hierarchy (Sect. 6)." },
                { title: "Secret Loophole", desc: "PIA 1982 muzzles disclosures in SADF, SAPS-Intel, and SSA." },
                { title: "Reverse Onus Deficit", desc: "Whistleblower must prove 'Good Faith' while the state has infinite resources." },
                { title: "External Harm Void", desc: "Zero protection for blacklisting or threats outside the office." },
              ].map((kill, i) => (
                <li key={i} className="flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-accent-crimson shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-foreground">{kill.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{kill.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-accent-gold/30 bg-accent-gold/[0.05]">
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              "The PDA is well-intended but deficient in many important respects... it is not pro-active in providing physical protection." 
              <span className="block mt-2 font-bold text-accent-gold">— Chief Justice Raymond Zondo</span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Incentive Calculator ── */}
      <motion.section
        id="calculator"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent-gold/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold">Whistleblower Incentive Calculator</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <IncentiveCalculator />
        </div>
      </motion.section>

      {/* ── CTA Strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
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
                <p className="text-[10px] text-muted-foreground">{cta.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
        </motion.div>

      {/* ── Global Accountability Benchmarks ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent-blue/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-blue">Global Intelligence Benchmarks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              country: "Brazil", 
              model: "Transparency Portal", 
              feature: "Real-time Spend Tracking",
              status: "GOLD STANDARD",
              color: "text-emerald-500",
              desc: "SA equivalent: National Treasury OCPO (In development)."
            },
            { 
              country: "Indonesia", 
              model: "Bureaucratic Reform Index", 
              feature: "Institutional Compliance",
              status: "IMPLEMENTING",
              color: "text-accent-blue",
              desc: "SA equivalent: DPSA PAM Unit Audits."
            },
            { 
              country: "South Korea", 
              model: "ACRC Citizen Feedback", 
              feature: "Real-time Reporting",
              status: "PLANNED",
              color: "text-accent-gold",
              desc: "SA equivalent: NACS Knowledge Portal."
            },
            { 
              country: "Rwanda", 
              model: "Governance Score Card", 
              feature: "Public Accountability",
              status: "DRAFTING",
              color: "text-accent-crimson",
              desc: "SA equivalent: DPME NACS Dashboard."
            }
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 border-border-glass bg-bg-glass hover:bg-white/5 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-muted-foreground">{item.country}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border border-current/20 ${item.color} bg-current/5`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1 group-hover:text-accent-blue transition-colors">{item.model}</h4>
              <p className="text-[11px] text-foreground/70 mb-3">{item.feature}</p>
              <div className="pt-3 border-t border-white/5">
                <p className="text-[9px] text-muted-foreground italic leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── NACS Accountability Dashboard ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-accent-gold/30" />
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold">NACS Accountability Dashboard (2025-2030)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "State Capture Action Index", value: "34 / 60", sub: "Priority Actions Implemented", color: "text-accent-gold" },
            { label: "Ethics Officer Saturation", value: "82%", sub: "Departments with active units", color: "text-accent-blue" },
            { label: "Legislative Reform Status", value: "PHASE 2", sub: "PDA Amendment Drafting", color: "text-accent-crimson" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-4xl font-bold tracking-tighter ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pillar 1: Citizen Participation (The 'Silent Witness' Gap) */}
          <div className="glass-card p-8 border-border-glass bg-bg-glass">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-accent-blue" />
              <h3 className="text-lg font-bold tracking-tight">Pillar 1: Citizen Participation</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: "Officials' Reporting Propensity", target: "80%", current: "46%", source: "DPSA/HSRC" },
                { label: "Schools with Integrity Curriculum", target: "100%", current: "12%", source: "DBE" },
                { label: "Whistleblower Confidence Index", target: "75%", current: "38%", source: "Social Norms 2023" },
              ].map((row, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-foreground/80">{row.label}</span>
                    <span className="text-muted-foreground">Source: {row.source}</span>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-accent-blue/30 w-full" />
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: row.current }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="absolute top-0 left-0 h-full bg-accent-blue" 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-accent-blue">Current: {row.current}</span>
                    <span className="text-muted-foreground">Target: {row.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 3: Ethical Governance (State Capture Cleanup) */}
          <div className="glass-card p-8 border-border-glass bg-bg-glass">
            <div className="flex items-center gap-3 mb-6">
              <Landmark className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg font-bold tracking-tight">Pillar 3: Ethical Governance</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: "Zondo Recommendation 1.2", desc: "Establish Anti-Corruption Agency", status: "PENDING" },
                { title: "Zondo Recommendation 4.1", desc: "Corporate Procurement Reform", status: "IN PROGRESS" },
                { title: "Zondo Recommendation 7.3", desc: "Whistleblower Reward Scheme", status: "DRAFTING" },
                { title: "Zondo Recommendation 9.0", desc: "Permanent State Capture Unit", status: "ACTIVE" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border-glass rounded-lg bg-white/5">
                  <div>
                    <p className="text-[10px] font-bold text-accent-gold mb-0.5">{item.title}</p>
                    <p className="text-[11px] text-foreground/80">{item.desc}</p>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                    item.status === "ACTIVE" ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" :
                    item.status === "IN PROGRESS" ? "border-accent-blue/50 text-accent-blue bg-accent-blue/10" :
                    "border-accent-crimson/50 text-accent-crimson bg-accent-crimson/10"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-border-glass text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground mb-4">Intelligence Source Registry</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed italic">
            This dashboard utilizes forensic extractions from PPLAAF Whistleblower Audits (2023), HSRC Social Norms Reports (2025), and the CLEAR-AA NACS Monitoring Framework (2024). 
            Data refreshed as of May 12, 2026.
          </p>
        </div>
      </footer>
    </PageShell>
  );
}
