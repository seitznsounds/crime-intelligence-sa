"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ShieldAlert, BarChart3, Fingerprint, Search, ShieldCheck, ChevronRight, Network, Scale } from "lucide-react";

export default function Home() {
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
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-crimson/30">
      {/* Background Intelligence Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      
      {/* Cinematic Blooms */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-crimson/5 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/5 rounded-full blur-[160px]" />

      <div className="container relative z-10 pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-bg-glass border border-border-glass mb-8 sm:mb-10 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-crimson"></span>
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Radical Transparency Active</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 tracking-tighter leading-[0.9] uppercase"
          >
            Democratizing <br />
            <span className="text-foreground/20">Intelligence for</span> <br />
            <span className="text-accent-crimson glow-text-crimson">Justice.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed font-light px-4"
          >
            South Africa's first high-fidelity intelligence hub. 
            We track the lifecycle of corruption—from street-level symptoms to the officials who facilitate them.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-5"
          >
            <Link href="/expose" className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-accent-crimson text-white text-[12px] font-bold uppercase tracking-[0.15em] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,59,48,0.2)] overflow-hidden text-center">
              <div className="absolute inset-0 bg-foreground/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter Exposure Board <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/stats" className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-bg-glass hover:bg-bg-glass-heavy text-muted-foreground hover:text-foreground text-[12px] font-bold uppercase tracking-[0.15em] rounded-2xl border border-border-glass transition-all text-center">
              SAPS Station Audits
            </Link>
          </motion.div>

          {/* Value Props */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-20 sm:mt-32 text-left"
          >
            {[
              { 
                icon: <ShieldAlert className="w-5 h-5 text-accent-crimson" />, 
                title: "Real-Time Alerts", 
                desc: "Localized crime reporting with multi-stage verification protocols.",
                color: "accent-crimson" 
              },
              { 
                icon: <BarChart3 className="w-5 h-5 text-accent-blue" />, 
                title: "Station Audits", 
                desc: "Data-driven performance metrics for every SAPS station in the country.",
                color: "accent-blue" 
              },
              { 
                icon: <Fingerprint className="w-5 h-5 text-accent-gold" />, 
                title: "Expose Corruption", 
                desc: "Tracking the links between organized crime and high-level officials.",
                color: "accent-gold" 
              }
            ].map((feature, i) => (
              <div key={i} className="group p-6 sm:p-8 glass-card border-border-glass hover:border-border-glass-bright">
                <div className="w-10 h-10 bg-bg-glass rounded-xl flex items-center justify-center mb-5 border border-border-glass transition-all group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-[13px] font-bold mb-2 uppercase tracking-widest text-foreground">{feature.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Operational Counter */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-border-glass grid grid-cols-3 gap-6 sm:gap-16 max-w-lg sm:max-w-none mx-auto"
          >
            {[
              { label: "Indexed Records", value: "32,433" },
              { label: "High-Value Targets", value: "1,204" },
              { label: "SAPS Stations Map", value: "1,154" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl sm:text-2xl font-bold font-mono tracking-tighter mb-1 text-foreground">{stat.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
