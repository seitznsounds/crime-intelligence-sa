"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical System Breach:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Tactical Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent-crimson-opacity),transparent_70%)] opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-xl border-accent-crimson/30 bg-background/80 p-12 text-center relative z-10 shadow-glow shadow-accent-crimson/5"
      >
        <div className="w-20 h-20 bg-accent-crimson/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-crimson/20">
          <AlertTriangle className="w-10 h-10 text-accent-crimson animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-crimson/5 border border-accent-crimson/20 rounded-full mb-6">
          <ShieldAlert className="w-3 h-3 text-accent-crimson" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-crimson">System Breach Detected</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4 text-foreground">Intelligence Link Severed</h1>
        <p className="text-sm text-muted-foreground font-mono leading-relaxed mb-12 max-w-sm mx-auto">
          The encrypted connection to the intelligence database has been disrupted. Internal telemetry indicates a critical component failure.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow"
          >
            <RefreshCw className="w-4 h-4" /> Reconnect Link
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-bg-glass border border-border-glass text-foreground text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-bg-glass-heavy transition-all"
          >
            <Home className="w-4 h-4" /> Return to Base
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border-glass flex flex-col items-center gap-2">
          <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">Error_Digest: {error.digest || "UNKNOWN_ID"}</p>
          <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">Protocol: EMERGENCY_SHUTDOWN_V4.2</p>
        </div>
      </motion.div>
    </div>
  );
}
