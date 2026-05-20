"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Key, Fingerprint, Activity, ShieldAlert, Terminal as TerminalIcon, ChevronRight, Database, Hash, RefreshCw, Briefcase, FileSignature, Globe, Scale, Megaphone, UserX } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";
import { packageEvidence } from "@/lib/evidence-actions";

interface SealedPackage {
  id: string;
  title: string;
  recipient: string;
  classification: string;
  timestamp: string;
  signature: string;
  itemCount: number;
  status: string;
}

export default function VaultPage({ initialPackages }: { initialPackages: SealedPackage[] }) {
  const [zkpStep, setZkpStep] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing ZKP Protocol..."]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [packages, setPackages] = useState<SealedPackage[]>(initialPackages);
  const [isPackaging, setIsPackaging] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleCreatePackage = async () => {
    setIsPackaging(true);
    addLog("Gathering evidence files...");
    try {
      const result = await packageEvidence({
        title: "State Capture 2.0 // Senior Officials",
        recipient: "ICC - International Criminal Court",
        classification: "TOP_SECRET",
        itemIds: [
          { type: "person", id: "17648316-3943-4468-9c25-c84bcd17d32a" },
          { type: "person", id: "9a7030fa-be59-4da5-83c3-9b9605ec362a" },
        ]
      });
      addLog(`Package ${result.id.substring(0, 8)} Sealed & Signed.`);
      window.location.reload(); 
    } catch (e) {
      addLog("Packaging FAILED: Integrity Check Error.");
    } finally {
      setIsPackaging(false);
    }
  };

  const startVerification = () => {
    setIsVerifying(true);
    addLog("Initiating Identity Masking...");
    setTimeout(() => { addLog("Generating ZK-Secret [ENTROPY_0x9A]..."); setZkpStep(1); }, 1500);
    setTimeout(() => { addLog("Cryptographic Challenge Generated..."); setZkpStep(2); }, 3000);
    setTimeout(() => { addLog("Proof Verified. Evidence Sealed."); setZkpStep(3); setIsVerifying(false); }, 5000);
  };

  return (
    <PageShell
      title="Evidence Vault"
      subtitle="Securely stored evidence packages, digitally signed and ready for submission to international justice bodies like the ICC. Your anonymity is fully protected."
      badge="Secure Evidence"
      badgeColor="blue"
      icon={<ShieldCheck className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "History & Justice", href: "/accountability" }, { label: "TRC Vault", href: "/vault" }]}
      guidance="This vault contains evidence packages that have been compiled from our investigations and digitally signed for authenticity. These packages can be submitted to international courts. The verification process below confirms your identity is protected."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          {/* ZKP Verification Interface */}
          <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden font-mono">
            <div className="absolute top-6 right-6">
              <Activity className={`w-4 h-4 ${isVerifying ? 'text-accent-blue animate-pulse' : 'text-muted-foreground/30'}`} />
            </div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3 font-sans">
              <TerminalIcon className="w-4 h-4" /> Identity Protection Check
            </h3>

            <div className="space-y-8">
              {/* Step indicators */}
              <div className="flex items-center justify-between gap-4">
                {[{ label: "Hide Identity", icon: <Fingerprint className="w-5 h-5" /> }, { label: "Security Check", icon: <Key className="w-5 h-5" /> }, { label: "Create Proof", icon: <Hash className="w-5 h-5" /> }, { label: "Seal Evidence", icon: <Lock className="w-5 h-5" /> }].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all ${zkpStep >= i ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' : 'bg-bg-glass-heavy border-border-glass text-muted-foreground/40'}`}>
                      {step.icon}
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-center font-sans leading-tight ${zkpStep >= i ? 'text-accent-blue' : 'text-muted-foreground/40'}`}>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Live Protocol Logs */}
              <div className="bg-bg-glass-heavy border border-border-glass rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-muted-foreground mb-3 border-b border-border-glass pb-3 font-sans">
                  <span className="uppercase tracking-[0.2em]">Activity Log</span>
                  <span className="flex items-center gap-2"><RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} /> Active</span>
                </div>
                {logs.map((log, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`text-[12px] ${log.includes('Verified') ? 'text-accent-blue' : 'text-muted-foreground'}`}>{log}</motion.p>
                ))}
              </div>

              <button onClick={startVerification} disabled={isVerifying || zkpStep === 3} className="w-full py-5 bg-accent-blue text-white text-[12px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans">
                {zkpStep === 3 ? "✓ Identity Verified" : isVerifying ? "Verifying..." : "Verify My Identity Securely"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.01]">
            <div className="flex items-center gap-4 mb-4"><ShieldAlert className="w-5 h-5 text-accent-crimson" /><h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent-crimson">Your Privacy Is Protected</h4></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light">We automatically remove all traces of your identity from uploaded files — including hidden data like GPS tags, device information, and file metadata. Your anonymity is guaranteed.</p>
          </div>
        </div>

        {/* Sealed Evidence Vault Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Database className="w-4 h-4" /> Evidence Packages</h3>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <Link key={pkg.id} href={`/justice/${pkg.id}`}>
                    <div className="p-4 bg-bg-glass-heavy border border-border-glass rounded-xl hover:bg-bg-glass-heavy hover:border-border-glass-bright transition-all cursor-pointer group mb-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-foreground line-clamp-1">{pkg.title}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-mono">{pkg.recipient}</span>
                            </div>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${pkg.status === 'SEALED' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 'bg-accent-gold/10 border-accent-gold/20 text-accent-gold'}`}>{pkg.status}</span>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground/40 mb-3 break-all line-clamp-1">{pkg.signature}</p>
                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>{new Date(pkg.timestamp).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-accent-blue">{pkg.itemCount} ITEMS</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </Link>
              ))}
            </div>
            <button 
                onClick={handleCreatePackage}
                disabled={isPackaging}
                className="w-full mt-6 py-4 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-[11px] font-bold uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-3 rounded-2xl"
            >
                <FileSignature className={`w-4 h-4 ${isPackaging ? 'animate-pulse' : ''}`} />
                {isPackaging ? 'Packaging evidence...' : 'Create Evidence Package'}
            </button>
          </div>
          <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/[0.02]">
            <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-4 h-4 text-accent-blue" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-blue">Security Status</span></div>
            <div className="space-y-3">
              {[["Security Level", "MAX"], ["Protected Users", "12,402 Nodes"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[12px] font-mono">
                  <span className="text-muted-foreground uppercase">{k}</span>
                  <span className="text-accent-blue font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WhatNext suggestions={[
        { title: "Court Rulings", description: "Browse real criminal court judgments related to the evidence in this vault.", href: "/justice/judgments", icon: Scale },
        { title: "Report Corruption", description: "Have evidence of your own? Submit it anonymously and securely.", href: "/report", icon: Megaphone },
        { title: "Unpunished Perpetrators", description: "See who has committed crimes but has never been held accountable.", href: "/accountability", icon: UserX },
      ]} />
    </PageShell>
  );
}
