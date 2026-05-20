"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ShieldAlert,
  BarChart3,
  Fingerprint,
  Search,
  ShieldCheck,
  ChevronRight,
  Network,
  Scale,
  Cpu,
  Database,
  Globe,
  Zap,
  ArrowRight,
  Info,
  Brain,
  Activity,
  History,
  Megaphone,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecentIntelligence } from "@/lib/intelligence-actions";
import { NAV_PILLARS } from "@/lib/navigation";
import OnboardingBanner from "@/components/layout/OnboardingBanner";
import WhatNext from "@/components/layout/WhatNext";

export default function Home() {
  const [recentIntel, setRecentIntel] = useState<{ judgments: any[], news: any[] }>({ judgments: [], news: [] });

  useEffect(() => {
    fetchRecentIntelligence().then(setRecentIntel);
  }, []);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-background selection:bg-accent-blue/10 selection:text-accent-blue">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-accent-blue/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[60%] h-[60%] bg-accent-crimson/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 pt-24 sm:pt-32 lg:pt-40 pb-24 sm:pb-32 px-6 sm:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ONBOARDING BANNER — First-time visitors */}
          <OnboardingBanner />

          {/* HERO SECTION */}
          <div className="text-center mb-24 sm:mb-32">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-bg-glass border border-border mb-8 sm:mb-12"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-20"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-crimson"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-muted-foreground">Live — Tracking Corruption in Real Time</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[10vw] sm:text-5xl lg:text-6xl font-black mb-10 tracking-tight leading-[1.05] text-foreground italic break-words"
            >
              EXPOSING <br />
              <span className="text-muted-foreground font-normal not-italic">CORRUPTION.</span> <br />
              <span className="text-accent-blue">EMPOWERING CITIZENS.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              South Africa's largest independent corruption tracker.
              We follow the money, map the networks, and give you the evidence.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <Link href="/expose" className="w-full sm:w-auto px-10 py-5 bg-foreground text-background text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-accent-crimson hover:text-white active:scale-95 shadow-button-inset flex items-center justify-center gap-2">
                Explore the Evidence <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="w-full sm:w-auto px-10 py-5 bg-bg-glass hover:bg-bg-glass-heavy text-foreground text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl border border-border transition-all flex items-center justify-center gap-2 group">
                <Info className="w-4 h-4 text-accent-blue group-hover:rotate-12 transition-transform" /> How This Works
              </Link>
            </motion.div>
          </div>

          {/* MISSION OVERVIEW — LOGICAL LAYOUT */}
          <motion.div
            variants={itemVariants}
            className="mb-32 space-y-12"
          >
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent-crimson">How We Work</h2>
              <p className="text-2xl font-black uppercase tracking-tight italic text-foreground">How we uncover and expose corruption.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 relative">
              {/* Connector lines (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-border-glass -translate-y-1/2 z-0" />

              {[
                {
                  step: "01",
                  title: "We Gather the Evidence",
                  desc: "We collect thousands of documents — court records, government tenders, TRC archives, and news reports — into our secure database.",
                  icon: Database,
                  color: "blue"
                },
                {
                  step: "02",
                  title: "AI Finds the Connections",
                  desc: "Our AI reads every document and automatically identifies the people, organisations, and money flows that connect corrupt officials to crime networks.",
                  icon: Brain,
                  color: "gold"
                },
                {
                  step: "03",
                  title: "You See the Truth",
                  desc: "The evidence is presented through searchable profiles, interactive maps, and network diagrams so you can see exactly who is involved and how.",
                  icon: ShieldAlert,
                  color: "crimson"
                }
              ].map((flow, i) => (
                <div key={i} className="relative z-10 glass-card p-10 bg-background border border-border-glass flex flex-col items-center text-center group hover:bg-bg-glass transition-all">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 border-2 transition-all ${flow.color === 'crimson' ? 'border-accent-crimson/30 text-accent-crimson bg-accent-crimson/5 group-hover:bg-accent-crimson group-hover:text-white' :
                      flow.color === 'gold' ? 'border-accent-gold/30 text-accent-gold bg-accent-gold/5 group-hover:bg-accent-gold group-hover:text-black' :
                        'border-accent-blue/30 text-accent-blue bg-accent-blue/5 group-hover:bg-accent-blue group-hover:text-white'
                    }`}>
                    <flow.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black text-muted-foreground mb-2">{flow.step}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-4">{flow.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{flow.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* MAIN PILLARS GRID */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
          >
            {NAV_PILLARS.map((pillar, i) => (
              <div key={pillar.id} className="glass-card p-8 border-border-glass bg-bg-glass-heavy flex flex-col group hover:border-foreground/20 transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border transition-all ${pillar.color === 'crimson' ? 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson' :
                    pillar.color === 'gold' ? 'bg-accent-gold/10 border-accent-gold/20 text-accent-gold' :
                      'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'
                  }`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 italic">{pillar.label}</h3>
                <div className="space-y-3 mt-auto">
                  {pillar.items.slice(0, 3).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border hover:border-foreground/10 transition-all group/item"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground">{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover/item:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ENGINE PREVIEW */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-8 sm:p-12 border-border-glass bg-bg-glass-heavy relative overflow-hidden mb-32"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full opacity-10 pointer-events-none">
              <Cpu className="w-full h-full text-accent-blue" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/5 text-accent-blue text-[9px] font-black uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3" /> Under the Hood
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-foreground mb-6 italic">How the Platform Works</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                We use AI to automatically read thousands of documents — from court records to government tenders — and find the hidden connections between corrupt officials, shell companies, and crime syndicates.
              </p>
              <Link href="/about#engine" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent-blue hover:underline">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* STATS SECTION */}
          <motion.div
            variants={itemVariants}
            className="pt-16 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
          >
            {[
              { label: "Documents Analysed", value: "32,433", icon: <Database className="w-4 h-4 text-accent-gold" /> },
              { label: "People of Interest", value: "1,204", icon: <Fingerprint className="w-4 h-4 text-accent-crimson" /> },
              { label: "Police Stations Tracked", value: "1,154", icon: <Globe className="w-4 h-4 text-accent-blue" /> },
              { label: "Evidence Items", value: "8.4k", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  {stat.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black font-mono tracking-tighter text-foreground">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* LIVE INTEL FEED */}
          <motion.div
            variants={itemVariants}
            className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="glass-card p-10 border-border-glass bg-bg-glass-heavy relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue" />
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-blue/10 rounded-2xl border border-accent-blue/20">
                      <Scale className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black uppercase tracking-tight">Latest Court Rulings</h3>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Criminal Cases</p>
                    </div>
                  </div>
                   <Link href="/justice/judgments" className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em] hover:underline">View All</Link>
               </div>

               <div className="space-y-4">
                  {recentIntel.judgments.map(j => (
                    <Link key={j.id} href={`/justice/judgments/${j.id}`} className="block p-4 bg-background/50 border border-border-glass rounded-xl hover:bg-accent-blue/5 hover:border-accent-blue/30 transition-all group/item">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-mono text-muted-foreground uppercase">{j.metadata?.['Case Number'] || 'RULING'}</span>
                          <span className="text-[9px] font-bold text-accent-blue/60 uppercase">{new Date(j.event_date).toLocaleDateString()}</span>
                       </div>
                       <h4 className="text-[13px] font-bold leading-tight group-hover/item:text-accent-blue transition-colors line-clamp-1">{j.title}</h4>
                    </Link>
                  ))}
                   {recentIntel.judgments.length === 0 && <p className="text-[10px] uppercase font-mono text-muted-foreground animate-pulse">Loading court rulings...</p>}
               </div>
            </div>

            <div className="glass-card p-10 border-border-glass bg-bg-glass-heavy relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent-crimson" />
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-crimson/10 rounded-2xl border border-accent-crimson/20">
                      <History className="w-6 h-6 text-accent-crimson" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black uppercase tracking-tight">Latest News</h3>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Recent Reports</p>
                    </div>
                  </div>
                  <Activity className="w-5 h-5 text-accent-crimson animate-pulse" />
               </div>

               <div className="space-y-4">
                  {recentIntel.news.map(n => (
                    <div key={n.id} className="p-4 bg-background/50 border border-border-glass rounded-xl transition-all hover:bg-accent-crimson/[0.02]">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-mono text-accent-crimson uppercase font-black">{n.type}</span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(n.occurred_at).toLocaleDateString()}</span>
                       </div>
                       <h4 className="text-[13px] font-bold leading-tight line-clamp-1">{n.title}</h4>
                    </div>
                  ))}
                   {recentIntel.news.length === 0 && <p className="text-[10px] uppercase font-mono text-muted-foreground animate-pulse">Loading recent reports...</p>}
                </div>
            </div>
          </motion.div>

          {/* WHERE TO GO NEXT */}
          <WhatNext suggestions={[
            { title: "People of Interest", description: "Browse profiles of politicians and officials linked to corruption.", href: "/expose", icon: "Search" },
            { title: "Crime Map", description: "See where crime is happening across South Africa on an interactive map.", href: "/map", icon: "Globe" },
            { title: "Report Corruption", description: "Anonymously report corruption — your identity is fully protected.", href: "/report", icon: "Megaphone" },
          ]} />
        </motion.div>
      </div>
    </div>
  );
}
