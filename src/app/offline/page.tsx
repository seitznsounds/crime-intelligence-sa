"use client";

import { WifiOff, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="p-8 rounded-full bg-accent-crimson/10 border border-accent-crimson/20">
            <WifiOff className="w-16 h-16 text-accent-crimson" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-foreground">Connection Lost</h1>
          <p className="text-muted-foreground leading-relaxed">
            You are currently operating in a low-connectivity zone. 
            The Digital Vigilance Protocol is now using local cached intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-foreground text-background rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Attempt Re-Uplink
          </button>
          
          <Link 
            href="/"
            className="w-full py-4 bg-bg-glass border border-border-glass text-foreground rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-bg-glass-heavy transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Command
          </Link>
        </div>

        <div className="pt-8 border-t border-border-glass">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Protocol: OFFLINE_CACHING_V1.0
          </p>
        </div>
      </div>
    </div>
  );
}
