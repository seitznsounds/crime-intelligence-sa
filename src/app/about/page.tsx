"use client";

import { motion, Variants } from "framer-motion";
import { Shield, Eye, Database, Scale, Fingerprint, Lock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function AboutPage() {
  return (
    <PageShell
      title="Exposing the Helms of Power"
      subtitle="Crime in South Africa is not just a street-level issue; it is a systemic failure engineered from the top."
      badge="Operational Manifesto"
      badgeColor="crimson"
      icon={<Shield className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 mb-16 sm:mb-24">
          <motion.section variants={itemVariants} className="space-y-5">
            <div className="glass-card p-7 sm:p-8 border-accent-crimson/10 bg-accent-crimson/[0.01]">
              <h3 className="text-[14px] font-bold uppercase tracking-widest text-accent-crimson mb-4 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> The Root Cause
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed font-light">
                Corruption at the highest helms of power allows crime to flourish. 
                Hijackers and drug dealers are symptoms; the ones they work for—the police officers who make dockets disappear and the officials who turn stolen cars into "legal" assets—are the true targets.
              </p>
            </div>
            <div className="glass-card p-7 sm:p-8 border-border-glass bg-bg-glass">
              <h3 className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4" /> The Objective
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed font-light">
                If we do not expose the criminals in power, they will always roam free while the citizens suffer. 
                We use data as our weapon to disrupt this cycle and demand systemic accountability.
              </p>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="flex flex-col justify-center">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-foreground/30 mb-8">Mission: Radical Transparency</h2>
            <div className="space-y-7">
              {[
                { icon: <Eye className="w-5 h-5 text-accent-blue" />, title: "Democratize Intelligence", desc: "Provide free, uncorrupted data to every citizen to empower informed decision making." },
                { icon: <Lock className="w-5 h-5 text-accent-gold" />, title: "Expose Corruption", desc: "Document and highlight the links between organized crime and government officials." },
                { icon: <Database className="w-5 h-5 text-muted-foreground" />, title: "Systemic Accountability", desc: "Track the 'lifecycle' of crime—from the street to the official who legitimizes it." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-[14px] font-bold uppercase tracking-widest mb-2 text-foreground">{item.title}</h4>
                    <p className="text-[13px] text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.footer variants={itemVariants} className="pt-10 border-t border-border-glass">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="font-mono text-[11px] text-foreground/30 uppercase tracking-[0.3em]">VERIFIED_VIGILANTE_PROTOCOL // 2026</div>
            <p className="text-[12px] text-muted-foreground/50 max-w-sm italic">"Data is the ultimate weapon against those who pull the strings in the shadows."</p>
          </div>
        </motion.footer>
      </motion.div>
    </PageShell>
  );
}
