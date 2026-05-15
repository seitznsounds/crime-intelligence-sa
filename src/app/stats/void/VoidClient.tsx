"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EyeOff, AlertTriangle, ShieldCheck, Activity, BarChart3, Fingerprint, SlidersHorizontal } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

interface CrimeCategory {
  name: string;
  sapVolume: number;
  multiplier: number;
}

export default function VoidClient({ categories }: { categories: CrimeCategory[] }) {
  // Reality index from 0 (Official SAPS) to 1 (True StatsSA Reality)
  const [reality, setReality] = useState(0);

  // Interpolate values based on reality slider
  const maxMultiplier = 4.9;
  const currentGlobalMultiplier = 1 + (maxMultiplier - 1) * reality;
  
  // Inverse relationship: as reality approaches 1, trust approaches 24% (from a baseline of say 60%)
  const publicTrust = 60 - (36 * reality);

  return (
    <PageShell
      title="The Reporting Void"
      subtitle="Interactive visualization of the gap between official SAPS recordings and StatsSA lived realities."
      badge="Data Integrity Audit"
      badgeColor="crimson"
      icon={<EyeOff className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Data", href: "/stats" },
        { label: "Reporting Void", href: "/stats/void" }
      ]}
    >
      {/* The Reality Engine Slider */}
      <div className="glass-card p-8 sm:p-12 mb-12 border-border-glass bg-bg-glass-heavy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-gold to-accent-crimson" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center sm:text-left">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mb-2">
              <SlidersHorizontal className="w-4 h-4" /> Reality Engine
            </h3>
            <p className="text-sm text-foreground font-medium">Drag to reveal the structural reporting gap.</p>
          </div>
          <div className="flex gap-4">
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${reality < 0.5 ? 'border-accent-blue/50 text-accent-blue bg-accent-blue/10' : 'border-border-glass text-muted-foreground'}`}>Official SAPS</span>
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${reality >= 0.5 ? 'border-accent-crimson/50 text-accent-crimson bg-accent-crimson/10' : 'border-border-glass text-muted-foreground'}`}>StatsSA Reality</span>
          </div>
        </div>

        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={reality}
          onChange={(e) => setReality(parseFloat(e.target.value))}
          className="w-full h-4 bg-charcoal-3 rounded-full appearance-none outline-none cursor-pointer slider-thumb-crimson transition-all"
          style={{
            background: `linear-gradient(to right, var(--accent-crimson) ${reality * 100}%, var(--charcoal-3) ${reality * 100}%)`
          }}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Impact HUD */}
        <div className="space-y-8">
          <motion.div 
            className="glass-card p-8 border"
            animate={{
              backgroundColor: `rgba(${reality * 255}, ${(1-reality) * 50}, 50, 0.05)`,
              borderColor: `rgba(${reality * 255}, 59, 48, ${0.1 + reality * 0.4})`
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">True Multiplier</span>
              <Activity className="w-5 h-5 text-accent-crimson" style={{ opacity: 0.3 + reality * 0.7 }} />
            </div>
            <div className="flex items-baseline gap-2">
              <motion.span className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground font-mono">
                {currentGlobalMultiplier.toFixed(1)}
              </motion.span>
              <span className="text-2xl font-bold text-accent-crimson">x</span>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-4 font-medium">Home Robbery Delta Scaling</p>
          </motion.div>

          <motion.div 
            className="glass-card p-8 border border-border-glass bg-bg-glass"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Public Trust Index</span>
              <ShieldCheck className="w-5 h-5" style={{ color: `rgba(${reality * 255}, ${(1-reality) * 200}, 250, 1)` }} />
            </div>
            <motion.p className="text-4xl font-black tracking-tighter font-mono" style={{ color: `rgba(${reality * 255}, ${(1-reality) * 200}, 250, 1)` }}>
              {publicTrust.toFixed(1)}%
            </motion.p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-4 font-medium">Likelihood to report incidents to SAPS</p>
          </motion.div>
        </div>

        {/* Dynamic Category Growth Chart */}
        <div className="lg:col-span-2 glass-card p-8 border-border-glass bg-bg-glass">
          <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-10 flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-accent-crimson" /> Category Reporting Gap
          </h3>

          <div className="space-y-10">
            {categories.map((cat, idx) => {
              // Calculate the current volume based on the specific category multiplier and slider
              const targetVolume = cat.sapVolume * cat.multiplier;
              const currentVolume = cat.sapVolume + ((targetVolume - cat.sapVolume) * reality);
              const maxAllCategories = Math.max(...categories.map(c => c.sapVolume * c.multiplier));
              const widthPercentage = (currentVolume / maxAllCategories) * 100;

              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold uppercase tracking-tight text-foreground">{cat.name}</span>
                    <span className="text-lg font-mono font-black tracking-tighter">
                      {Math.round(currentVolume).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Background Track */}
                  <div className="h-6 w-full bg-charcoal-3 rounded-md overflow-hidden relative border border-border-glass">
                    {/* The Fill Bar */}
                    <motion.div 
                      className="h-full rounded-md shadow-[0_0_15px_rgba(255,59,48,0.2)]"
                      style={{
                        background: `linear-gradient(90deg, var(--accent-blue) 0%, ${reality > 0.1 ? 'var(--accent-crimson)' : 'var(--accent-blue)'} 100%)`
                      }}
                      initial={{ width: `${(cat.sapVolume / maxAllCategories) * 100}%` }}
                      animate={{ width: `${widthPercentage}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                    
                    {/* Ghost bar showing the SAPS baseline to highlight the gap */}
                    <div 
                      className="absolute top-0 left-0 h-full border-r-2 border-white/40 z-10"
                      style={{ width: `${(cat.sapVolume / maxAllCategories) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">SAPS Baseline</span>
                    {reality > 0.1 && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[9px] font-bold text-accent-crimson uppercase tracking-widest"
                      >
                        + Missing Dockets
                      </motion.span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
