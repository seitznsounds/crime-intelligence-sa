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
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-blue/10 selection:text-accent-blue">
      {/* Editorial warmth via generous vertical padding */}
      <div className="container relative z-10 pt-24 sm:pt-32 lg:pt-48 pb-24 sm:pb-32 px-6 sm:px-8">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status Badge - Opacity driven neutral */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-charcoal-3 border border-border mb-12 sm:mb-16"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-crimson"></span>
            </span>
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-charcoal-40">Intelligence Hub Active</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-9xl font-black mb-10 sm:mb-14 tracking-tight leading-[1.05] text-charcoal"
          >
            Democratizing <br />
            <span className="text-charcoal-40 font-normal italic">Intelligence for</span> <br />
            <span className="text-accent-blue">Justice.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-charcoal-82 max-w-3xl mx-auto mb-16 sm:mb-20 leading-relaxed font-normal"
          >
            South Africa's first high-fidelity intelligence hub. 
            We track the lifecycle of systemic corruption from street-level symptoms to the officials who facilitate them.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            <Link href="/expose" className="w-full sm:w-auto px-10 sm:px-12 py-5 bg-charcoal text-[#fcfbf8] text-[13px] font-black uppercase tracking-[0.2em] rounded-full transition-all hover:opacity-80 active:scale-95 shadow-button-inset text-center">
              Exposure Board <ChevronRight className="ml-2 w-4 h-4 inline-block" />
            </Link>
            <Link href="/stats" className="w-full sm:w-auto px-10 sm:px-12 py-5 bg-transparent hover:bg-charcoal-3 text-charcoal text-[13px] font-black uppercase tracking-[0.2em] rounded-full border border-charcoal-40 transition-all text-center">
              Station Audits
            </Link>
          </motion.div>

          {/* Value Props - Flat bordered cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-32 sm:mt-48 text-left"
          >
            {[
              { 
                icon: <ShieldAlert className="w-6 h-6 text-accent-crimson" />, 
                title: "Forensic Data", 
                desc: "Localized crime reporting with multi-stage verification protocols."
              },
              { 
                icon: <BarChart3 className="w-6 h-6 text-accent-blue" />, 
                title: "Station Audits", 
                desc: "Data-driven performance metrics for every station in the country."
              },
              { 
                icon: <Fingerprint className="w-6 h-6 text-accent-gold" />, 
                title: "Expose Board", 
                desc: "Tracking the links between organized crime and high-level officials."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 sm:p-10 glass-card bg-background border-border hover:border-charcoal-40">
                <div className="w-12 h-12 bg-charcoal-3 rounded-[18px] flex items-center justify-center mb-8 border border-border group-hover:border-charcoal-40 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-[14px] font-black mb-4 uppercase tracking-[0.2em] text-charcoal">{feature.title}</h3>
                <p className="text-[15px] text-charcoal-82 leading-relaxed font-normal">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Operational Counter */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 sm:mt-32 pt-16 sm:pt-20 border-t border-border grid grid-cols-3 gap-8 sm:gap-24 max-w-2xl sm:max-w-none mx-auto"
          >
            {[
              { label: "Indexed Records", value: "32,433" },
              { label: "High-Value Targets", value: "1,204" },
              { label: "SAPS Stations Map", value: "1,154" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-4xl font-black font-mono tracking-tighter mb-2 text-charcoal">{stat.value}</p>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal-40">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
