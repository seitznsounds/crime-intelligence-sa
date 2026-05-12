import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function DeepExposurePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: person, error: personError } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (personError || !person) return notFound();

  const { data: exposures } = await supabase.from("exposures").select("*").eq("person_id", id);

  const getRiskColor = (score: number | null) => {
    if (!score) return 'var(--border-glass)';
    if (score > 80) return 'var(--accent-crimson)';
    if (score > 50) return 'var(--accent-gold)';
    return 'var(--accent-blue)';
  };

  return (
    <div className="container py-8 animate-fade-in max-w-6xl">
      {/* Breadcrumb - Precise & Small */}
      <nav className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20">
        <Link href="/expose" className="hover:text-accent-crimson transition-colors">Intelligence Hub</Link>
        <span className="opacity-50">/</span>
        <span className="text-muted-foreground/40 italic font-mono uppercase">Case_{person.id.split('-')[0]}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-1">
            <div className="aspect-[4/5] bg-bg-glass rounded-[18px] overflow-hidden flex items-center justify-center border border-border-glass">
              {person.profile_image_url ? (
                <img src={person.profile_image_url} alt={person.full_name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-70" />
              ) : (
                <span className="text-7xl font-bold text-muted-foreground/[0.03] uppercase tracking-tighter">{person.full_name.charAt(0)}</span>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 bg-white/[0.01]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6 flex items-center justify-between">
              Threat Matrix
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getRiskColor(person.risk_score) }} />
            </h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/[0.03]" />
                  <circle 
                    cx="40" cy="40" r="36" 
                    stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 * (1 - (person.risk_score || 0) / 100)}
                    style={{ color: getRiskColor(person.risk_score) }}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,59,48,0.2)]"
                  />
                </svg>
                <span className="absolute text-xl font-bold font-mono tracking-tighter">{person.risk_score || '??'}%</span>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Risk Evaluation</p>
                <p className="text-base font-bold tracking-tight" style={{ color: getRiskColor(person.risk_score) }}>
                  {person.risk_score && person.risk_score > 80 ? 'CRITICAL_ASSET' : person.risk_score && person.risk_score > 50 ? 'ELEVATED_WATCH' : 'NOMINAL_STATE'}
                </p>
              </div>
            </div>
            
            <div className="space-y-1 mt-4">
              {[
                { label: 'PEP TIER', value: person.pep_tier || 'UNCLASSIFIED', highlight: 'text-accent-gold' },
                { label: 'OP_STATUS', value: person.status || 'UNKNOWN', highlight: 'uppercase' },
                { label: 'IDENTITY', value: person.id_number ? 'VERIFIED' : 'PENDING', highlight: person.id_number ? 'text-accent-blue' : 'text-white/20' }
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center py-2.5 border-b border-white/[0.03] text-[10px] font-mono">
                  <span className="text-white/20">{stat.label}</span>
                  <span className={`font-bold ${stat.highlight}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Dossier Content */}
        <div className="lg:col-span-8 space-y-6">
          <header className="mb-4">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/5 text-accent-crimson text-[9px] font-bold tracking-widest uppercase rounded border border-accent-crimson/10 mb-4">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Intelligence Dossier_Alpha
            </div>
            <h1 className="text-5xl font-bold tracking-tighter mb-1 uppercase">{person.full_name}</h1>
            <p className="text-lg text-white/30 font-medium tracking-tight italic">{person.role || 'Government Official / High-Value Target'}</p>
          </header>

          {/* Expanded Metadata - Flat & Clean */}
          <div className="glass-card p-6 bg-white/[0.01]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-4 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Intelligence Context & Footprint
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {person.metadata ? (
                Object.entries(person.metadata).flatMap(([key, value]) => {
                  if (key === 'metadata' && typeof value === 'object' && value !== null) {
                    return Object.entries(value).map(([sk, sv]) => ({ k: sk, v: sv }));
                  }
                  return typeof value !== 'object' ? [{ k: key, v: value }] : [];
                }).map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center py-1 border-b border-white/[0.03] text-[10px] font-mono">
                    <span className="text-white/20 capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="text-accent-blue/80 truncate max-w-[140px] text-right">{String(v)}</span>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-[10px] text-white/10 italic">No additional metadata indexed.</p>
              )}
            </div>
          </div>

          {/* Corruption Timeline - Redesigned for Precision */}
          <section className="glass-card p-8 bg-white/[0.02]">
            <h2 className="text-xs font-bold mb-10 flex items-center gap-3 uppercase tracking-widest text-white/30">
              <span className="w-0.5 h-4 bg-accent-crimson rounded-full" />
              Operational History & Evidence
            </h2>
            
            <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.05]">
              {exposures && exposures.length > 0 ? (
                exposures.map((exp) => (
                  <div key={exp.id} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-crimson shadow-[0_0_8px_rgba(255,59,48,0.5)]" />
                    </div>
                    <div className="glass-card p-5 border-white/[0.05] hover:border-accent-crimson/20 bg-white/[0.01]">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base font-bold tracking-tight">{exp.title}</h3>
                        <span className="text-[9px] font-mono text-white/20">{new Date(exp.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-white/40 mb-5 leading-relaxed font-light">{exp.summary}</p>
                      
                      {exp.evidence_links && (
                        <div className="flex flex-wrap gap-2">
                          {exp.evidence_links.map((link: string, i: number) => (
                            <a key={i} href={link} target="_blank" className="px-2 py-1 bg-white/[0.03] hover:bg-white/[0.08] rounded border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-1.5">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                              EV_DOC_{i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-white/[0.05] font-mono text-[10px] uppercase tracking-widest border border-dashed border-white/[0.05] rounded-3xl">
                  Tracing cross-referenced nodes... No verified exposures.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
