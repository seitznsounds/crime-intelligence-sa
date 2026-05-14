"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cpu, Activity, Database, GitBranch, Lock, Server, Zap, ChevronRight, Globe, Layers, Heart, Network } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import DataTabs from "@/components/ui/DataTabs";
import dynamic from 'next/dynamic';

const DonationModule = dynamic(() => import('@/components/intel/DonationModule').then(mod => mod.DonationModule), {
  ssr: false,
  loading: () => (
    <div className="glass-card border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
    </div>
  )
});

export default function AboutClient({ telemetry }: { telemetry: any }) {
  const [activeTab, setActiveTab] = useState("manifesto");

  const TABS = [
    { id: "manifesto", label: "Manifesto & Journey" },
    { id: "engine", label: "The Engine" },
    { id: "telemetry", label: "Live Telemetry" }
  ];

  return (
    <PageShell
      title="Platform Architecture"
      subtitle="Exposing the sophisticated intelligence engine powering radical transparency."
      badge="System Overview"
      badgeColor="blue"
      icon={<Cpu className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" }
      ]}
    >
      <DataTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MANIFESTO */}
          {activeTab === "manifesto" && (
            <motion.div
              key="manifesto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Manifesto Hero */}
              <div className="glass-card p-10 sm:p-16 border-accent-crimson/20 bg-gradient-to-br from-background to-accent-crimson/5 text-center">
                <Shield className="w-16 h-16 text-accent-crimson mx-auto mb-6" />
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-foreground mb-6">
                  Exposing the Helms of Power
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                  Crime is not just a street-level issue; it is a systemic failure engineered from the top. 
                  Hijackers and syndicates are symptoms. The officials who make dockets disappear and legitimize stolen assets are the true targets. 
                  <strong className="text-foreground font-bold"> We use data as our weapon to disrupt this cycle.</strong>
                </p>
              </div>

              {/* Intelligence Lifecycle Timeline */}
              <div>
                <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-8 text-center">The Intelligence Lifecycle</h3>
                <div className="max-w-2xl mx-auto relative">
                  <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-border-glass" />
                  
                  {[
                    { title: "1. Ingestion", desc: "Automated scraping of TRC records, PPLAAF audits, and live incidents using Apify RAG pipelines.", icon: <Database className="w-4 h-4" /> },
                    { title: "2. AI Distillation", desc: "Semantic processing to extract relational nodes, linking PEPs to syndicates using custom pgvector embeddings.", icon: <Cpu className="w-4 h-4" /> },
                    { title: "3. Exposure", desc: "Generating high-fidelity forensic dossiers and interactive network maps to expose the corruption web.", icon: <Globe className="w-4 h-4" /> },
                    { title: "4. Weaponization", desc: "Cryptographically packaging dossiers into signed PDFs for submission to international justice bodies (ICC).", icon: <Lock className="w-4 h-4" /> }
                  ].map((step, idx) => (
                    <div key={idx} className="relative pl-24 pb-10 group">
                      <div className="absolute left-6 top-0 w-5 h-5 rounded-full bg-charcoal-3 border-2 border-accent-blue flex items-center justify-center z-10 group-hover:bg-accent-blue transition-colors">
                        <div className="w-1.5 h-1.5 bg-background rounded-full" />
                      </div>
                      <div className="glass-card p-6 border-border-glass bg-bg-glass group-hover:border-accent-blue/50 transition-colors">
                        <div className="flex items-center gap-3 mb-2 text-accent-blue">
                          {step.icon}
                          <h4 className="text-sm font-black uppercase tracking-widest">{step.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: THE ENGINE */}
          {activeTab === "engine" && (
            <motion.div
              key="engine"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Architecture Diagram Concept */}
              <div className="glass-card p-10 border-border-glass bg-bg-glass-heavy overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                  <Layers className="w-64 h-64 text-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-8">RAG & Ingestion Architecture</h3>
                
                <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
                  <div className="flex-1 glass-card p-6 border-border-glass bg-charcoal/50 text-center relative z-10">
                    <Database className="w-8 h-8 text-accent-gold mx-auto mb-3" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1 text-accent-gold">Raw Sources</h4>
                    <p className="text-[10px] text-muted-foreground">TRC Archives, StatsSA, UNODC</p>
                  </div>
                  
                  <div className="hidden sm:flex items-center justify-center text-muted-foreground">
                    <ChevronRight className="w-6 h-6" />
                  </div>

                  <div className="flex-1 glass-card p-6 border-accent-blue/30 bg-accent-blue/5 text-center relative z-10">
                    <Cpu className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1 text-accent-blue">Agentic Distillation</h4>
                    <p className="text-[10px] text-muted-foreground">Apify Actors & LLM Formatting</p>
                  </div>

                  <div className="hidden sm:flex items-center justify-center text-muted-foreground">
                    <ChevronRight className="w-6 h-6" />
                  </div>

                  <div className="flex-1 glass-card p-6 border-border-glass bg-charcoal/50 text-center relative z-10">
                    <Server className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1 text-emerald-500">Supabase Core</h4>
                    <p className="text-[10px] text-muted-foreground">pgvector & Edge Functions</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-8 border-border-glass bg-bg-glass">
                  <GitBranch className="w-6 h-6 text-accent-blue mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">pgvector Semantic Core</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Utilizing 384-dimensional embeddings to perform semantic searches across millions of forensic documents and intelligence nodes.
                  </p>
                </div>
                <div className="glass-card p-8 border-border-glass bg-bg-glass">
                  <Lock className="w-6 h-6 text-accent-crimson mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Cryptographic Integrity</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Evidence packages are signed using pseudo-SHA-256 hashes, ensuring that exported dossiers submitted to the ICC remain tamper-proof.
                  </p>
                </div>
                <div className="glass-card p-8 border-border-glass bg-bg-glass">
                  <Shield className="w-6 h-6 text-accent-gold mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Zero-Knowledge Vault</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Whistleblower submissions are routed through an AES-256 simulated encryption protocol, stripping metadata before ingestion.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: TELEMETRY */}
          {activeTab === "telemetry" && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Live System Health */}
                <div className="space-y-4">
                  <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-6">System Health</h3>
                  {[
                    { label: "Supabase DB Core", status: "Operational", color: "emerald" },
                    { label: "Apify RAG Actors", status: "Idle / Ready", color: "blue" },
                    { label: "Evidence Packaging", status: "Secure", color: "emerald" },
                    { label: "Vector Search API", status: "High Load", color: "gold" }
                  ].map((sys, idx) => (
                    <div key={idx} className="glass-card p-4 border-border-glass bg-bg-glass flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{sys.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">{sys.status}</span>
                        <div className={`w-2 h-2 rounded-full bg-${sys.color === 'emerald' ? 'emerald-500' : sys.color === 'blue' ? 'accent-blue' : 'accent-gold'} shadow-glow-${sys.color === 'emerald' ? 'emerald' : sys.color === 'blue' ? 'blue' : 'gold'} animate-pulse`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-accent-blue" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Records Processed</span>
                    </div>
                    <p className="text-4xl font-black font-mono tracking-tighter text-foreground">{telemetry.recordsProcessed.toLocaleString()}</p>
                  </div>
                  
                  <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-4 h-4 text-accent-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PEPs Mapped</span>
                    </div>
                    <p className="text-4xl font-black font-mono tracking-tighter text-foreground">{telemetry.pepsMapped.toLocaleString()}</p>
                  </div>

                  <div className="glass-card p-8 border-accent-crimson/30 bg-accent-crimson/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-accent-crimson" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent-crimson">High-Risk Links</span>
                    </div>
                    <p className="text-4xl font-black font-mono tracking-tighter text-accent-crimson">{telemetry.highRiskLinks}</p>
                  </div>

                  <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Uptime</span>
                    </div>
                    <p className="text-4xl font-black font-mono tracking-tighter text-emerald-500">{telemetry.uptime}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Global Support Section */}
        <div id="support" className="mt-20 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-crimson/30 bg-accent-crimson/10 text-accent-crimson text-[10px] font-bold uppercase tracking-widest">
              <Heart className="w-3 h-3" />
              Sustain the Network
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">Support the Mission</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              This platform is an independent investigative tool. Your contributions directly fuel our RAG architecture, vector database maintenance, and forensic data ingestion pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Context/Info */}
            <div className="space-y-6">
              <div className="glass-card p-8 border border-border-glass bg-bg-glass space-y-6 rounded-2xl">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-accent-blue mb-2">Project Transparency</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    100% of project-specific donations are allocated to cloud infrastructure (Supabase, Apify) and data acquisition. We believe in weaponizing data against corruption, and your support ensures this weapon remains sharp and accessible to all citizens.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-accent-gold mb-2">Buy Creator a Coffee</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Building and maintaining this sophisticated intelligence hub is a solo effort. If you find value in this tool, supporting the creator directly helps cover the thousands of hours of architectural design and engineering required to keep the system evolving.
                  </p>
                </div>
                <div className="pt-4 border-t border-border-glass">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Shield className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Verified Secure</p>
                      <p className="text-[9px] text-muted-foreground">Transactions are encrypted and processed via Paystack.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Module */}
            <DonationModule />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
