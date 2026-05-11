import React from 'react';
import Link from 'next/link';

interface ExposureCardProps {
  person: {
    id: string;
    full_name: string;
    pep_tier: number | null;
    risk_score: number | null;
    status: string | null;
    role: string | null;
    profile_image_url: string | null;
    metadata?: any;
  };
}

export const ExposureCard = ({ person }: ExposureCardProps) => {
  // Flexible source extraction
  const source = person.metadata?.original_source || 
                 person.metadata?.metadata?.source || 
                 person.metadata?.metadata?.affiliation ||
                 person.metadata?.affiliation;

  const getRiskColor = (score: number | null) => {
    if (!score) return 'rgba(255,255,255,0.1)';
    if (score > 80) return '#ff3b30';
    if (score > 50) return '#ffcc00';
    return '#34c759';
  };

  return (
    <div className="glass-card overflow-hidden group border-white/5 hover:border-white/20 transition-all duration-500">
      <div className="relative h-44 bg-white/[0.02] flex items-center justify-center overflow-hidden">
        {person.profile_image_url ? (
          <img 
            src={person.profile_image_url} 
            alt={person.full_name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="text-5xl font-bold text-white/5 uppercase tracking-tighter">{person.full_name.charAt(0)}</div>
        )}
        
        {source && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40">
            {source}
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskColor(person.risk_score) }}></div>
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/70">Risk {person.risk_score || '??'}%</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold group-hover:text-accent-crimson transition-colors leading-tight">{person.full_name}</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">{person.role || 'Unspecified Role'}</p>
          </div>
          {person.pep_tier && (
            <div className="bg-accent-gold/5 text-accent-gold text-[9px] px-1.5 py-0.5 rounded border border-accent-gold/20 font-bold uppercase tracking-tighter">
              Tier {person.pep_tier}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link 
            href={`/expose/${person.id}`}
            className="flex-1 py-2 bg-white/5 hover:bg-accent-crimson text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 hover:border-accent-crimson transition-all text-center"
          >
            Dossier
          </Link>
          <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg border border-white/10 transition-all flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
