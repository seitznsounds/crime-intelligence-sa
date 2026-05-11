"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  History, 
  Map as MapIcon, 
  ShieldAlert, 
  Scale, 
  Activity, 
  ChevronRight, 
  MapPin, 
  Users, 
  Zap,
  ArrowRight
} from "lucide-react";

const STOLEN_ZONES = [
  { 
    id: "ZONE_01", 
    name: "District Six", 
    city: "Cape Town", 
    date: "1966-02-11", 
    families: 60000, 
    risk: 100,
    status: "UNRESOLVED",
    desc: "Declared a white-only area under the Group Areas Act. Forced removal of over 60,000 residents and total demolition of a multi-cultural hub."
  },
  { 
    id: "ZONE_02", 
    name: "Sophiatown", 
    city: "Johannesburg", 
    date: "1955-02-09", 
    families: 65000, 
    risk: 100,
    status: "IN_PROGRESS",
    desc: "A legendary cultural hub destroyed to make way for 'Triomf'. Residents forcibly moved to Meadowlands, Soweto."
  },
  { 
    id: "ZONE_03", 
    name: "Cato Manor", 
    city: "Durban", 
    date: "1958-03-22", 
    families: 120000, 
    risk: 98,
    status: "UNRESOLVED",
    desc: "One of the largest forced removals in South African history, displacing over 120,000 people to townships like KwaMashu."
  }
];

export default function RestitutionPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  return (
    <div className="relative min-h-screen bg-[#050000] overflow-hidden selection:bg-accent-crimson/30">
      {/* Background Cinematic Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff3b3005,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container py-20 relative z-10 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-crimson/10 rounded-2xl flex items-center justify-center border border-accent-crimson/20 shadow-glow-crimson">
              <History className="w-6 h-6 text-accent-crimson" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-1">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Land Restitution Sector</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Reclaim the Land</h1>
            </div>
          </div>
        </header>

        {/* Tactical HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Stolen Hectares", value: "1.2M", icon: <MapIcon className="w-4 h-4 text-accent-crimson" /> },
            { label: "Displaced Families", value: "3.5M+", icon: <Users className="w-4 h-4 text-accent-crimson" /> },
            { label: "Unresolved Cases", value: "8,204", icon: <ShieldAlert className="w-4 h-4 text-accent-gold" /> },
            { label: "Restoration Rate", value: "12.4%", icon: <Activity className="w-4 h-4 text-accent-blue" /> }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Historical Map Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card h-[600px] border-white/5 bg-black/40 relative overflow-hidden group">
              {/* Simplified SA Map with Red Zones */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 1000 1000" className="w-[80%] h-[80%] opacity-20 grayscale">
                   <path d="M200,750 L150,850 L250,950 L550,900 L850,550 L800,250 L650,150 L350,150 L200,450 Z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2" />
                </svg>
                
                {/* Highlighted Stolen Zones */}
                <motion.circle cx="180" cy="780" r="40" className="fill-accent-crimson/20 stroke-accent-crimson animate-pulse cursor-pointer" onClick={() => setSelectedZone(STOLEN_ZONES[0])} />
                <motion.circle cx="620" cy="320" r="30" className="fill-accent-crimson/20 stroke-accent-crimson animate-pulse cursor-pointer" onClick={() => setSelectedZone(STOLEN_ZONES[1])} />
                <motion.circle cx="780" cy="480" r="35" className="fill-accent-crimson/20 stroke-accent-crimson animate-pulse cursor-pointer" onClick={() => setSelectedZone(STOLEN_ZONES[2])} />
              </div>

              <div className="absolute bottom-8 left-8 p-6 glass-card bg-black/60 border-white/5 backdrop-blur-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-crimson mb-2 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> High-Density Displacement Zone
                </h4>
                <p className="text-[9px] font-mono text-white/40 uppercase">Sector: DISTRICT_SIX // STATUS: UNRESTORED</p>
              </div>

              <div className="absolute top-8 right-8 space-y-3">
                <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5" /> Historical Layer
                </button>
                <button className="flex items-center gap-3 px-4 py-2 bg-accent-crimson/10 border border-accent-crimson/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-accent-crimson transition-all backdrop-blur-md">
                  <Scale className="w-3.5 h-3.5" /> Restitution Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stolen Land Dossiers */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-8 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-accent-crimson" /> Injustice Dossiers
            </h3>
            
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              {STOLEN_ZONES.map((zone, i) => (
                <motion.div 
                  key={zone.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedZone(zone)}
                  className={`glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all ${selectedZone?.id === zone.id ? 'border-accent-crimson/40 bg-accent-crimson/[0.02]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">ID: {zone.id}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${zone.status === 'UNRESOLVED' ? 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'}`}>
                      {zone.status}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold tracking-tighter uppercase mb-2">{zone.name}</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/20">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-mono uppercase">{zone.city}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-light mb-6 line-clamp-2">
                    {zone.desc}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <span>{zone.families.toLocaleString()} Displaced</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Case Overlay */}
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
          >
            <div className="glass-card w-full max-w-4xl border-white/10 bg-black/90 p-12 relative shadow-glow-crimson overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setSelectedZone(null)}
                className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white"
              >
                Close Case [ESC]
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 border border-accent-crimson/10 rounded mb-4">
                      <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Crimes Against Humanity // SEIZURE_REPORT</span>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase mb-4 leading-none">{selectedZone.name}</h2>
                    <p className="text-lg font-mono text-white/40 uppercase tracking-widest">{selectedZone.city}, South Africa</p>
                  </div>

                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <History className="w-4 h-4" /> Historical Context
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed font-light italic">
                      "{selectedZone.desc}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 border-white/5">
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Seizure Date</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter">{selectedZone.date}</p>
                    </div>
                    <div className="glass-card p-6 border-white/5">
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Displacement</p>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-accent-crimson">{selectedZone.families.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center group overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800" alt="Historical Displacement" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-accent-crimson/10 mix-blend-overlay" />
                    <div className="absolute bottom-8 left-8 right-8 glass-card p-4 bg-black/60 border-white/5 backdrop-blur-md">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">ARCHIVE_VISUAL_001: Historical Removal Site</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Restitution Status</h5>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-accent-crimson" initial={{ width: 0 }} animate={{ width: "15%" }} />
                       </div>
                       <span className="text-xs font-mono font-bold text-accent-crimson">15% RESOLVED</span>
                    </div>
                    <button className="w-full mt-6 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-crimson hover:text-white transition-all group">
                      Sign Petition for Land Restoration <ArrowRight className="inline-flex w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
