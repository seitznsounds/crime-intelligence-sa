"use client";

import { motion, Variants } from "framer-motion";
import { Shield, Eye, Database, Scale, Fingerprint, Lock } from "lucide-react";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-background py-24">
      {/* Technical Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,#ff3b3005,transparent_50%)]" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_0%_100%,#007aff05,transparent_50%)]" />

      <motion.div 
        className="container max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="mb-20">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-accent-crimson/5 border border-accent-crimson/10 mb-6">
            <Shield className="w-3.5 h-3.5 text-accent-crimson" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Operational Manifesto</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none uppercase mb-6 text-foreground">
            Exposing the <br />
            <span className="text-foreground/20">Helms of</span> Power.
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            Crime in South Africa is not just a street-level issue; it is a systemic failure engineered from the top.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="glass-card p-8 border-accent-crimson/10 bg-accent-crimson/[0.01]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent-crimson mb-4 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                The Root Cause
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Corruption at the highest helms of power allows crime to flourish. 
                Hijackers and drug dealers are symptoms; the ones they work for—the police officers who make dockets disappear and the officials who turn stolen cars into "legal" assets—are the true targets.
              </p>
            </div>
            <div className="glass-card p-8 border-border-glass bg-bg-glass">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                The Objective
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                If we do not expose the criminals in power, they will always roam free while the citizens suffer. 
                We use data as our weapon to disrupt this cycle and demand systemic accountability.
              </p>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="flex flex-col justify-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/20 mb-8">Mission: Radical Transparency</h2>
            <div className="space-y-8">
              {[
                { 
                  icon: <Eye className="w-5 h-5 text-accent-blue" />, 
                  title: "Democratize Intelligence", 
                  desc: "Provide free, uncorrupted data to every citizen to empower informed decision making." 
                },
                { 
                  icon: <Lock className="w-5 h-5 text-accent-gold" />, 
                  title: "Expose Corruption", 
                  desc: "Document and highlight the links between organized crime and government officials." 
                },
                { 
                  icon: <Database className="w-5 h-5 text-muted-foreground" />, 
                  title: "Systemic Accountability", 
                  desc: "Track the 'lifecycle' of crime—from the street to the official who legitimizes it." 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.footer variants={itemVariants} className="pt-12 border-t border-border-glass">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="font-mono text-[10px] text-foreground/20 uppercase tracking-[0.3em]">
              VERIFIED_VIGILANTE_PROTOCOL // 2026
            </div>
            <p className="text-[10px] text-muted-foreground/50 max-w-sm italic">
              "Data is the ultimate weapon against those who pull the strings in the shadows."
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
