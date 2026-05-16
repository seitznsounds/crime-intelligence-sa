import React, { useState } from 'react';
import Link from 'next/link';
import { Skull } from 'lucide-react';
import { IntelligenceDrawer } from "@/components/intel/IntelligenceDrawer";


interface ExposureCardProps {
  person: {
    id: string;
    full_name: string;
    pep_tier: number | null;
    risk_score: number | null;
    status: string | null;
    role: string | null;
    profile_image_url: string | null;
    is_deceased?: boolean | null;
    metadata?: any;
  };
}

export const ExposureCard = ({ person }: ExposureCardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Flexible source extraction
  const source = person.metadata?.original_source || 
                 person.metadata?.metadata?.source || 
                 person.metadata?.metadata?.affiliation ||
                 person.metadata?.affiliation;
                 
  const status = person.status || person.metadata?.status || person.metadata?.metadata?.status;

  const getRiskColor = (score: number | null) => {
    if (!score) return 'var(--border-glass)';
    if (score > 80) return 'var(--accent-crimson)';
    if (score > 50) return 'var(--accent-gold)';
    return 'var(--accent-blue)';
  };

  return (
    <div className="glass-card overflow-hidden group border-border-glass hover:border-border-glass-bright transition-all duration-500 bg-bg-glass">
      <div className="relative h-44 bg-bg-glass-heavy flex items-center justify-center overflow-hidden">
        {person.is_deceased && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="px-4 py-2 border-2 border-accent-crimson rounded-lg transform -rotate-12 bg-black/80 shadow-2xl">
               <span className="text-xl font-black text-accent-crimson uppercase tracking-[0.3em] flex items-center gap-2">
                 <Skull className="w-5 h-5" /> Deceased
               </span>
            </div>
          </div>
        )}
        
        {person.profile_image_url ? (
          <img 
            src={person.profile_image_url} 
            alt={person.full_name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="text-5xl font-bold text-muted-foreground/10 uppercase tracking-tighter">{person.full_name.charAt(0)}</div>
        )}
        
        {source && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-background/60 backdrop-blur-md rounded border border-border-glass text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            {source}
          </div>
        )}

        {status && (
          <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 backdrop-blur-md ${
            ['Suspended', 'Arrested', 'Under Investigation', 'Implicated'].includes(status) 
              ? 'bg-accent-crimson/20 border-accent-crimson text-accent-crimson animate-pulse' 
              : 'bg-accent-blue/20 border-accent-blue text-accent-blue'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${['Suspended', 'Arrested', 'Under Investigation', 'Implicated'].includes(status) ? 'bg-accent-crimson shadow-glow-crimson' : 'bg-accent-blue shadow-glow-blue'}`}></div>
            {status}
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-0.5 bg-background/80 backdrop-blur-md rounded-full border border-border-glass flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskColor(person.risk_score) }}></div>
          <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Risk {person.risk_score || '??'}%</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold group-hover:text-accent-crimson transition-colors leading-tight text-foreground">{person.full_name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{person.role || 'Unspecified Role'}</p>
          </div>
          {person.pep_tier && (
            <div className="bg-accent-gold/5 text-accent-gold text-[9px] px-1.5 py-0.5 rounded border border-accent-gold/20 font-bold uppercase tracking-tighter">
              Tier {person.pep_tier}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="flex-1 py-2 bg-bg-glass hover:bg-accent-crimson text-muted-foreground hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-border-glass hover:border-accent-crimson transition-all text-center"
          >
            Quick Intelligence
          </button>
          
          <Link 
            href={`/expose/${person.id}`}
            className="px-3 py-2 bg-bg-glass hover:bg-bg-glass-heavy text-muted-foreground hover:text-foreground rounded-lg border border-border-glass transition-all flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </Link>
        </div>
      </div>

      <IntelligenceDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        entityId={person.id}
        entityType={person.pep_tier ? 'PEP' : 'Person of Interest'}
        entityName={person.full_name}
        baseRisk={person.risk_score || 50}
      />
    </div>
  );
};
