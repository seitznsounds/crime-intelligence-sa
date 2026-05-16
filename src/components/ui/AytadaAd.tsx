"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface AytadaAdProps {
  variant?: 'card' | 'banner' | 'inline' | 'showcase';
  className?: string;
}

export function AytadaAd({ variant = 'card', className = "" }: AytadaAdProps) {
  const AYTADA_URL = "https://aytada.app";

  if (variant === 'showcase') {
    return (
      <div className={`relative overflow-hidden border-t border-border-glass bg-background group ${className}`}>
        <div className="container max-w-7xl py-10 sm:py-16 px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground rounded flex items-center justify-center shrink-0 shadow-2xl">
                   <img src="/marketing/aytada/logo.svg" alt="Aytada" className="w-5 h-5 sm:w-6 sm:h-6 invert" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue bg-accent-blue/10 px-3 py-1 rounded border border-accent-blue/20">Official Design Partner</span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase text-foreground leading-[0.95]">
                  Stop guessing with <span className="text-accent-blue">generic AI.</span>
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Generate high-converting videos, banners, and jingles in 5 minutes. No agency fees, no creative blocks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                <a 
                  href={AYTADA_URL}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-foreground text-background text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all shadow-xl hover:shadow-glow-blue flex items-center justify-center gap-3"
                >
                  Launch Your Studio <ArrowRight className="w-4 h-4" />
                </a>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                  +3.2× CTR Delta • Zero Credit Tier
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 hidden sm:block">
              <div className="absolute inset-0 bg-accent-blue/20 blur-[100px] rounded-full opacity-10 group-hover:opacity-30 transition-opacity" />
              <motion.div 
                whileHover={{ y: -5, rotateX: 1, rotateY: -1 }}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border-glass shadow-2xl bg-bg-glass-heavy max-w-[280px] lg:max-w-[320px] mx-auto"
              >
                <img 
                  src="/marketing/aytada/aytada_studio_dashboard_showcase.webp" 
                  alt="Aytada Studio Dashboard" 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl flex items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center shrink-0">
             <img src="/marketing/aytada/logo.svg" alt="Aytada" className="w-5 h-5 invert" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-foreground">Aytada Marketing Studio</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">+3.2x Higher CTR vs Generic AI</p>
          </div>
        </div>
        <a 
          href={AYTADA_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-foreground text-background text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-accent-blue hover:text-white transition-all flex items-center gap-2"
        >
          Launch <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden glass-card p-6 border-accent-blue/30 bg-accent-blue/5 group ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent-blue/20 transition-colors" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center shrink-0 shadow-xl">
              <img src="/marketing/aytada/logo.svg" alt="Aytada" className="w-8 h-8 invert" />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tighter uppercase text-foreground">Stop guessing with generic AI.</h4>
              <p className="text-sm text-muted-foreground font-medium">Generate high-converting videos, banners, and jingles in 5 minutes.</p>
            </div>
          </div>
          <a 
            href={AYTADA_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3 bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Launch Your Studio Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-5 border-border-glass bg-bg-glass group hover:border-accent-blue/30 transition-all ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shrink-0">
          <img src="/marketing/aytada/logo.svg" alt="Aytada" className="w-5 h-5 invert" />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 bg-bg-glass-heavy px-2 py-0.5 rounded border border-border-glass">Sponsored</span>
      </div>
      
      <h4 className="text-xs font-black tracking-widest uppercase text-foreground mb-2 group-hover:text-accent-blue transition-colors">Engineering Conversions</h4>
      <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
        Generates strategic multi-channel ads anchored in the 5 Stages of Customer Awareness.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-background/40 p-2 rounded border border-border-glass">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">CTR Delta</p>
          <p className="text-sm font-black text-accent-blue">+3.2×</p>
        </div>
        <div className="bg-background/40 p-2 rounded border border-border-glass">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Render Time</p>
          <p className="text-sm font-black text-foreground">90s</p>
        </div>
      </div>

      <a 
        href={AYTADA_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full py-2.5 bg-foreground text-background text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-accent-blue hover:text-white transition-all flex justify-center items-center gap-2"
      >
        Start for Free <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
