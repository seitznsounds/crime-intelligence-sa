'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingUp, Info, Zap, AlertTriangle } from 'lucide-react';

const REPORTING_GAP_MULTIPLIER = 4.9; // StatsSA experienced vs recorded gap for Home Robbery
const HOUSEBREAKING_MULTIPLIER = 2.1;

export default function TrueCrimeEstimator({ initialCount, category }: { initialCount: number, category: string }) {
  const [enabled, setEnabled] = useState(false);
  
  const multiplier = category.toLowerCase().includes('home robbery') ? REPORTING_GAP_MULTIPLIER : 
                     category.toLowerCase().includes('housebreaking') ? HOUSEBREAKING_MULTIPLIER : 1.0;
  
  const estimatedCount = enabled ? Math.round(initialCount * multiplier) : initialCount;
  const delta = estimatedCount - initialCount;

  return (
    <div className={`glass-card p-4 border transition-all duration-500 ${enabled ? 'border-accent-crimson/40 bg-accent-crimson/[0.03]' : 'border-white/10'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${enabled ? 'text-accent-crimson animate-pulse' : 'text-muted-foreground'}`} />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">True Crime Estimator</h4>
        </div>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`relative w-8 h-4 rounded-full transition-colors ${enabled ? 'bg-accent-crimson' : 'bg-white/10'}`}
        >
          <motion.div 
            animate={{ x: enabled ? 18 : 2 }}
            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-lg"
          />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Recorded</span>
          <span className="text-lg font-mono font-bold text-foreground">{initialCount.toLocaleString()}</span>
        </div>
        
        {enabled && multiplier > 1 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-2 border-t border-accent-crimson/20"
          >
            <div className="flex justify-between items-end text-accent-crimson">
              <span className="text-[10px] font-mono uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Estimate ({multiplier}x)
              </span>
              <span className="text-xl font-mono font-black tracking-tighter">
                {estimatedCount.toLocaleString()}
              </span>
            </div>
            <div className="mt-3 p-2 bg-accent-crimson/10 rounded flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-accent-crimson flex-shrink-0 mt-0.5" />
              <p className="text-[9px] text-accent-crimson/80 leading-tight italic">
                Gap Analysis finding: {delta.toLocaleString()} additional incidents likely occurred but were not recorded in official dockets.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {!enabled && (
        <div className="mt-4 flex items-center gap-2 opacity-30">
          <Info className="w-3 h-3" />
          <span className="text-[9px] font-medium uppercase tracking-tight text-muted-foreground">Toggle to apply StatsSA Reporting Gap</span>
        </div>
      )}
    </div>
  );
}
