"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Fingerprint, 
  Activity, 
  ShieldAlert, 
  Terminal as TerminalIcon,
  ChevronRight,
  Database,
  Hash,
  RefreshCw
} from "lucide-react";

const SEALED_PACKAGES = [
  { id: "PKG_882A", hash: "SHA512_0x44B1...92F1", status: "VERIFIED", timestamp: "2026-05-11 23:42:11" },
  { id: "PKG_401X", hash: "SHA512_0x22C9...81B4", status: "PENDING_HATCH", timestamp: "2026-05-11 23:51:04" },
  { id: "PKG_219Z", hash: "SHA512_0x99D3...11A2", status: "SEALED", timestamp: "2026-05-12 00:04:22" },
];

export default function VaultPage() {
  const [zkpStep, setZkpStep] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing ZKP Protocol..."]);
  const [isVerifying, setIsVerifying] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startVerification = () => {
    setIsVerifying(true);
    addLog("Initiating Identity Masking...");
    setTimeout(() => {
      addLog("Generating ZK-Secret [ENTROPY_0x9A]...");
      setZkpStep(1);
    }, 1500);
    setTimeout(() => {
      addLog("Cryptographic Challenge Generated...");
      setZkpStep(2);
    }, 3000);
    setTimeout(() => {
      addLog("Proof Verified. Evidence Sealed.");
      setZkpStep(3);
      setIsVerifying(false);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-accent-blue/30 font-mono">
      {/* Cinematic Cyber Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#007aff05,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center border border-accent-blue/20">
              <ShieldCheck className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-blue/5 border border-accent-blue/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-blue font-sans">Whistleblower Protection 2.0</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase font-sans">Zero-Knowledge Vault</h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ZKP Verification Interface */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Activity className={`w-4 h-4 ${isVerifying ? 'text-accent-blue animate-pulse' : 'text-white/10'}`} />
              </div>

              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-10 flex items-center gap-3 font-sans">
                <TerminalIcon className="w-4 h-4" /> ZKP_VERIFICATION_GATE
              </h3>

              <div className="space-y-12">
                <div className="flex items-center justify-between gap-8">
                  {[
                    { label: "Identity Masking", icon: <Fingerprint className="w-5 h-5" /> },
                    { label: "Challenge Response", icon: <Key className="w-5 h-5" /> },
                    { label: "Proof Generation", icon: <Hash className="w-5 h-5" /> },
                    { label: "Vault Seal", icon: <Lock className="w-5 h-5" /> }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 group">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${zkpStep >= i ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-glow-blue' : 'bg-white/5 border-white/10 text-white/20'}`}>
                        {step.icon}
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-widest text-center max-w-[60px] ${zkpStep >= i ? 'text-accent-blue' : 'text-white/20'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-8 font-mono text-[10px] space-y-4">
                  <div className="flex justify-between items-center text-white/20 mb-4 border-b border-white/5 pb-4">
                    <span className="uppercase tracking-[0.2em]">Live Protocol Logs</span>
                    <span className="flex items-center gap-2"><RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} /> SYNC_ACTIVE</span>
                  </div>
                  {logs.map((log, i) => (
                    <motion.p 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={`${log.includes('Verified') ? 'text-accent-blue' : 'text-white/40'}`}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>

                <button 
                  onClick={startVerification}
                  disabled={isVerifying || zkpStep === 3}
                  className="w-full py-6 bg-accent-blue text-white text-xs font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.01] transition-all shadow-glow-blue disabled:opacity-50 disabled:grayscale font-sans"
                >
                  {zkpStep === 3 ? "IDENTITY_VERIFIED_SECURE" : isVerifying ? "PROVING_IDENTITY_MASK..." : "INITIATE_ZKP_HANDSHAKE"}
                </button>
              </div>
            </div>

            <div className="glass-card p-10 border-accent-crimson/20 bg-accent-crimson/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <ShieldAlert className="w-5 h-5 text-accent-crimson" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-crimson font-sans">Vulnerability Alert: Metadata Leakage</h4>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light mb-0 font-sans">
                Our ZKP protocol automatically strips EXIF data, device fingerprints, and routing headers before proof generation. 
                Absolute anonymity is not an option; it is the default operational standard.
              </p>
            </div>
          </div>

          {/* Sealed Evidence Vault Sidebar */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3 font-sans">
                <Database className="w-4 h-4" /> Sealed Evidence
              </h3>
              <div className="space-y-6">
                {SEALED_PACKAGES.map((pkg, i) => (
                  <div key={pkg.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-white/80">{pkg.id}</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${pkg.status === 'VERIFIED' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 'bg-accent-gold/10 border-accent-gold/20 text-accent-gold'}`}>
                        {pkg.status}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-white/20 mb-4 break-all">{pkg.hash}</p>
                    <div className="flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>{pkg.timestamp}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all font-sans">
                Access Personal Vault
              </button>
            </div>

            <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-4 h-4 text-accent-blue" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue font-sans">ZKP Integrity</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/20 uppercase">Network_Entropy</span>
                  <span className="text-accent-blue font-bold">MAX</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/20 uppercase">Anonymity_Set</span>
                  <span className="text-accent-blue font-bold">12,402 Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
