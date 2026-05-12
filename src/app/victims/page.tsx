"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Heart, 
  MessageSquare, 
  History, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  Award,
  Globe,
  Quote
} from "lucide-react";

const VICTIMS = [
  { 
    id: "VIC_01", 
    name: "The Cradock Four", 
    date: "1985-06-27", 
    violation: "Abduction & Murder", 
    location: "Eastern Cape",
    desc: "Matthew Goniwe, Fort Calata, Sparrow Mkhonto, and Sicelo Mhlauli. Forcibly removed and murdered by security police. Their stories symbolize the brutal suppression of community leadership."
  },
  { 
    id: "VIC_02", 
    name: "The Pebco Three", 
    date: "1985-05-08", 
    violation: "Forced Disappearance", 
    location: "Port Elizabeth",
    desc: "Qaqawuli Godolozi, Champion Galela, and Sipho Hashe. Lured to an airport and abducted by Vlakplaas operatives. Their remains were only identified years later."
  },
  { 
    id: "VIC_03", 
    name: "Ahmed Timol", 
    date: "1971-10-27", 
    violation: "Death in Detention", 
    location: "John Vorster Square",
    desc: "Anti-apartheid activist who allegedly 'jumped' from the 10th floor of John Vorster Square police station. The TRC and subsequent inquests confirmed he was murdered."
  }
];

export default function VictimsPage() {
  const [selectedVictim, setSelectedVictim] = useState<any>(null);
  const [tributeCount, setTributeCount] = useState(12402);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent-blue/30 transition-colors duration-300">
      {/* Somber Memorial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,var(--accent-blue-opacity),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-blue/5 border border-accent-blue/10 rounded mb-4">
            <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-accent-blue font-mono">TRC Volume 7: Living Monument</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter uppercase mb-6 text-foreground">Victim Tributes</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            "A tribute to the victims of Apartheid and a living monument to those who sacrificed so much in order that we could all enjoy the fruits of democracy."
          </p>
        </header>

        {/* Memorial HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Statements Received", value: "21,297", icon: <MessageSquare className="w-4 h-4 text-accent-blue" /> },
            { label: "Gross Violations Found", value: "14,500", icon: <ShieldCheck className="w-4 h-4 text-accent-blue" /> },
            { label: "Amnesty Applications", value: "7,112", icon: <History className="w-4 h-4 text-accent-gold" /> },
            { label: "Public Tributes", value: tributeCount.toLocaleString(), icon: <Heart className="w-4 h-4 text-accent-crimson" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Victim Wall */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
              <Award className="w-4 h-4 text-accent-blue" /> The Wall of Remembrance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VICTIMS.map((victim, i) => (
                <motion.div 
                  key={victim.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedVictim(victim)}
                  className="glass-card p-10 border-border-glass bg-bg-glass hover:bg-bg-glass-bright transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-muted-foreground opacity-5 group-hover:opacity-10 transition-opacity">
                    <Quote className="w-12 h-12" />
                  </div>
                  
                  <div className="mb-8">
                    <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mb-2 block">{victim.date} // {victim.location}</span>
                    <h4 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-foreground">{victim.name}</h4>
                    <p className="text-[10px] font-bold text-accent-blue tracking-[0.2em] uppercase">{victim.violation}</p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed font-light mb-8 line-clamp-3">
                    {victim.desc}
                  </p>

                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Read Full Statement</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full py-6 border border-dashed border-border-glass rounded-2xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-border-glass-bright transition-all">
              Load More Statements from Archive [Volume 7]
            </button>
          </div>

          {/* Right Sidebar: Memorial Integrity */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-border-glass bg-bg-glass backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                <Globe className="w-4 h-4 text-accent-blue" /> Truth Archive Status
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Victim List Vol 7", status: "VERIFIED", progress: 100 },
                  { label: "Regional Audits", status: "SYNCING", progress: 45 },
                  { label: "Amnesty Findings", status: "QUEUED", progress: 0 }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-foreground/80 uppercase">{item.label}</span>
                      <span className={`tracking-widest ${item.status === 'VERIFIED' ? 'text-accent-blue' : 'text-accent-gold'}`}>{item.status}</span>
                    </div>
                    <div className="h-1 bg-bg-glass-heavy rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.status === 'VERIFIED' ? 'bg-accent-blue shadow-glow-blue' : 'bg-accent-gold shadow-glow-gold'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-4 h-4 text-accent-crimson" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">The Living Monument</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light italic mb-8">
                "Their stories symbolize the greater experience and suffering of our people, many of whom were not able to come forward to tell their own story."
              </p>
              <button 
                onClick={() => setTributeCount(prev => prev + 1)}
                className="w-full py-4 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent-blue hover:text-white transition-all"
              >
                Pay Digital Tribute
              </button>
            </div>
          </div>
        </div>

        {/* Victim Statement Overlay */}
        <AnimatePresence>
          {selectedVictim && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedVictim(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-2xl border-border-glass bg-background p-12 relative shadow-glow-blue"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedVictim(null)}
                  className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Close Statement [ESC]
                </button>

                <div className="space-y-10">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-accent-blue/20 rounded mb-4 bg-accent-blue/5">
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-blue">GROSS_VIOLATION_FINDING</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-2 leading-none text-foreground">{selectedVictim.name}</h2>
                    <p className="text-lg font-mono text-muted-foreground uppercase tracking-widest">{selectedVictim.location}</p>
                  </div>

                  <div className="p-10 bg-bg-glass border border-border-glass rounded-3xl relative">
                    <Quote className="absolute top-8 left-8 w-8 h-8 text-muted-foreground/10" />
                    <p className="text-base text-foreground/60 leading-relaxed font-light italic text-center px-8">
                      "{selectedVictim.desc}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 border-border-glass bg-bg-glass">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Finding Date</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-foreground">{selectedVictim.date}</p>
                    </div>
                    <div className="glass-card p-6 border-border-glass bg-bg-glass text-right">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Category</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-accent-blue uppercase">{selectedVictim.violation.split(' ')[0]}</p>
                    </div>
                  </div>

                  <button className="w-full py-5 border border-border-glass text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-bg-glass-heavy hover:text-foreground transition-all">
                    Download Full TRC Hearing Transcript
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
