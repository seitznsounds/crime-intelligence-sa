"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, MessageSquare, History, ShieldCheck, Activity, ChevronRight, Award, Globe, Quote } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

interface Victim {
  id: string;
  name: string;
  date: string;
  violation: string;
  location: string;
  desc: string;
}

export default function VictimsClient({ initialVictims }: { initialVictims: Victim[] }) {
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);
  const [tributeCount, setTributeCount] = useState(12402);
  const [victims, setVictims] = useState<Victim[]>(initialVictims);

  return (
    <PageShell
      title="Victim Tributes"
      subtitle='"A tribute to the victims of Apartheid and a living monument to those who sacrificed so much in order that we could all enjoy the fruits of democracy."'
      badge="TRC Volume 7: Living Monument"
      badgeColor="blue"
      icon={<Heart className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "History & Justice", href: "/accountability" }, { label: "Victim Tributes", href: "/victims" }]}
    >
      {/* Memorial HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: "Statements Received", value: "21,297", icon: <MessageSquare className="w-4 h-4 text-accent-blue" /> },
          { label: "Gross Violations Found", value: "14,500", icon: <ShieldCheck className="w-4 h-4 text-accent-blue" /> },
          { label: "Amnesty Applications", value: "7,112", icon: <History className="w-4 h-4 text-accent-gold" /> },
          { label: "Public Tributes", value: tributeCount.toLocaleString(), icon: <Heart className="w-4 h-4 text-accent-crimson" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 border-border-glass bg-bg-glass">
            <div className="flex justify-between items-start mb-3"><span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>{item.icon}</div>
            <p className="text-2xl font-bold tracking-tighter text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Award className="w-4 h-4 text-accent-blue" /> The Wall of Remembrance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {victims.map((victim, i) => (
              <motion.div key={victim.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedVictim(victim)}
                className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy transition-all group relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 p-6 text-muted-foreground opacity-5 group-hover:opacity-10 transition-opacity"><Quote className="w-10 h-10" /></div>
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase mb-2 block">{victim.date} // {victim.location}</span>
                  <h4 className="text-2xl font-bold tracking-tighter uppercase mb-2 text-foreground">{victim.name}</h4>
                  <p className="text-[12px] font-bold text-accent-blue tracking-[0.2em] uppercase">{victim.violation}</p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed font-light mb-6 line-clamp-3">{victim.desc}</p>
                <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Read Full Statement</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full py-5 border border-dashed border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-border-glass-bright transition-all">
            Load More Statements from Archive [Volume 7]
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3"><Globe className="w-4 h-4 text-accent-blue" /> Truth Archive Status</h3>
            <div className="space-y-5">
              {[
                { label: "Victim List Vol 7", status: "VERIFIED", progress: 100 },
                { label: "PPLAAF Forensic Audit", status: "VERIFIED", progress: 100 },
                { label: "Assassination Board", status: "SYNCING", progress: 65 },
                { label: "Amnesty Findings", status: "QUEUED", progress: 0 }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-foreground/80 uppercase">{item.label}</span>
                    <span className={`tracking-widest ${item.status === 'VERIFIED' ? 'text-accent-blue' : 'text-accent-gold'}`}>{item.status}</span>
                  </div>
                  <div className="h-1 bg-bg-glass-heavy rounded-full overflow-hidden">
                    <motion.div className={`h-full ${item.status === 'VERIFIED' ? 'bg-accent-blue' : 'bg-accent-gold'}`} initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/[0.01]">
            <div className="flex items-center gap-3 mb-4"><Heart className="w-4 h-4 text-accent-crimson" /><span className="text-[12px] font-bold uppercase tracking-widest text-accent-blue">The Living Monument</span></div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light italic mb-6">"Their stories symbolize the greater experience and suffering of our people, many of whom were not able to come forward to tell their own story."</p>
            <button onClick={() => setTributeCount(p => p + 1)} className="w-full py-3 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all">Pay Digital Tribute</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedVictim && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/90 backdrop-blur-sm" onClick={() => setSelectedVictim(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-2xl border-border-glass bg-background p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedVictim(null)} className="absolute top-6 right-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Close [ESC]</button>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-accent-blue/20 rounded mb-4 bg-accent-blue/5"><span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent-blue">GROSS_VIOLATION_FINDING</span></div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase mb-2 text-foreground">{selectedVictim.name}</h2>
                  <p className="text-[13px] font-mono text-muted-foreground uppercase">{selectedVictim.location}</p>
                </div>
                <div className="p-6 bg-bg-glass border border-border-glass rounded-2xl relative">
                  <Quote className="absolute top-5 left-5 w-6 h-6 text-muted-foreground/10" />
                  <p className="text-[14px] text-muted-foreground leading-relaxed font-light italic text-center px-6">"{selectedVictim.desc}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 border-border-glass bg-bg-glass"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Finding Date</p><p className="text-lg font-bold font-mono tracking-tighter text-foreground">{selectedVictim.date}</p></div>
                  <div className="glass-card p-4 border-border-glass bg-bg-glass text-right"><p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Category</p><p className="text-lg font-bold font-mono tracking-tighter text-accent-blue uppercase">{selectedVictim.violation.split(' ')[0]}</p></div>
                </div>
                <button className="w-full py-4 border border-border-glass text-muted-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-bg-glass-heavy hover:text-foreground transition-all">Download Full TRC Hearing Transcript</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
