"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldCheck, Lock, Key, Fingerprint, Activity, ShieldAlert, Terminal as TerminalIcon, ChevronRight, Database, Hash, RefreshCw } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const SEALED_PACKAGES = [
  { id: "PKG_882A", hash: "SHA512_0x44B1...92F1", status: "VERIFIED", timestamp: "2026-05-11 23:42:11" },
  { id: "PKG_401X", hash: "SHA512_0x22C9...81B4", status: "PENDING_HATCH", timestamp: "2026-05-11 23:51:04" },
  { id: "PKG_219Z", hash: "SHA512_0x99D3...11A2", status: "SEALED", timestamp: "2026-05-12 00:04:22" },
];

export default function VaultPage() {
  const [zkpStep, setZkpStep] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing ZKP Protocol..."]);
  const [isVerifying, setIsVerifying] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startVerification = () => {
    setIsVerifying(true);
    addLog("Initiating Identity Masking...");
    setTimeout(() => { addLog("Generating ZK-Secret [ENTROPY_0x9A]..."); setZkpStep(1); }, 1500);
    setTimeout(() => { addLog("Cryptographic Challenge Generated..."); setZkpStep(2); }, 3000);
    setTimeout(() => { addLog("Proof Verified. Evidence Sealed."); setZkpStep(3); setIsVerifying(false); }, 5000);
  };

  return (
    <PageShell
      title="Zero-Knowledge Vault"
      subtitle="Whistleblower Protection 2.0 — AES-256 encryption with ZKP identity masking. Your anonymity is the default operational standard."
      badge="Whistleblower Protection 2.0"
      badgeColor="blue"
      icon={<ShieldCheck className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "History & Justice", href: "/accountability" }, { label: "TRC Vault", href: "/vault" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          {/* ZKP Verification Interface */}
          <div className="glass-card p-8 border-border-glass bg-bg-glass relative overflow-hidden font-mono">
            <div className="absolute top-6 right-6">
              <Activity className={`w-4 h-4 ${isVerifying ? 'text-accent-blue animate-pulse' : 'text-muted-foreground/30'}`} />
            </div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3 font-sans">
              <TerminalIcon className="w-4 h-4" /> ZKP_VERIFICATION_GATE
            </h3>

            <div className="space-y-8">
              {/* Step indicators */}
              <div className="flex items-center justify-between gap-4">
                {[{ label: "Identity Masking", icon: <Fingerprint className="w-5 h-5" /> }, { label: "Challenge Response", icon: <Key className="w-5 h-5" /> }, { label: "Proof Generation", icon: <Hash className="w-5 h-5" /> }, { label: "Vault Seal", icon: <Lock className="w-5 h-5" /> }].map((step, i) => (
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
                  <span className="uppercase tracking-[0.2em]">Live Protocol Logs</span>
                  <span className="flex items-center gap-2"><RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} /> SYNC_ACTIVE</span>
                </div>
                {logs.map((log, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`text-[12px] ${log.includes('Verified') ? 'text-accent-blue' : 'text-muted-foreground'}`}>{log}</motion.p>
                ))}
              </div>

              <button onClick={startVerification} disabled={isVerifying || zkpStep === 3} className="w-full py-5 bg-accent-blue text-white text-[12px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans">
                {zkpStep === 3 ? "IDENTITY_VERIFIED_SECURE" : isVerifying ? "PROVING_IDENTITY_MASK..." : "INITIATE_ZKP_HANDSHAKE"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.01]">
            <div className="flex items-center gap-4 mb-4"><ShieldAlert className="w-5 h-5 text-accent-crimson" /><h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent-crimson">Vulnerability Alert: Metadata Leakage</h4></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light">Our ZKP protocol automatically strips EXIF data, device fingerprints, and routing headers before proof generation. Absolute anonymity is not an option; it is the default operational standard.</p>
          </div>
        </div>

        {/* Sealed Evidence Vault Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Database className="w-4 h-4" /> Sealed Evidence</h3>
            <div className="space-y-4">
              {SEALED_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-bg-glass-heavy border border-border-glass rounded-xl hover:bg-bg-glass-heavy hover:border-border-glass-bright transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[12px] font-bold text-foreground">{pkg.id}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${pkg.status === 'VERIFIED' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 'bg-accent-gold/10 border-accent-gold/20 text-accent-gold'}`}>{pkg.status}</span>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground mb-3 break-all">{pkg.hash}</p>
                  <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{pkg.timestamp}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border-glass text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Access Personal Vault</button>
          </div>
          <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/[0.02]">
            <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-4 h-4 text-accent-blue" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-blue">ZKP Integrity</span></div>
            <div className="space-y-3">
              {[["Network_Entropy", "MAX"], ["Anonymity_Set", "12,402 Nodes"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[12px] font-mono">
                  <span className="text-muted-foreground uppercase">{k}</span>
                  <span className="text-accent-blue font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
