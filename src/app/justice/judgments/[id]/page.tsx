import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { Gavel, Calendar, MapPin, Scale, Download, Printer, Globe, History, AlertTriangle, FileText, User, Briefcase, Tag } from "lucide-react";
import RelationshipGraph from "@/components/intel/RelationshipGraph";
import CaseLifecycle from "@/components/intel/CaseLifecycle";
import CorroborationTrigger from "@/components/intel/CorroborationTrigger";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JudgmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createServerClient();

  const { data: judgment, error } = await supabase
    .from("historical_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !judgment) notFound();

  const metadata = judgment.metadata || {};
  const tags = judgment.tags || [];

  // Fetch linked incidents
  const linkedIncidentIds = metadata.linked_incidents || [];
  let linkedIncidents: any[] = [];
  if (linkedIncidentIds.length > 0) {
    const { data } = await supabase.from('incidents').select('*').in('id', linkedIncidentIds);
    linkedIncidents = data || [];
  }

  // Generate dynamic nodes for the graph based on metadata
  const nodes: any[] = [{ id: 'case', name: judgment.title.split(' (')[0].substring(0, 50) + '...', type: 'Event' }];
  const edges: any[] = [];

  const judges = metadata['Judges'] || metadata['Judge(s)'];
  if (judges) {
    (Array.isArray(judges) ? judges : [judges]).forEach((j: string, i: number) => {
      nodes.push({ id: `judge-${i}`, name: j, type: 'Person' });
      edges.push({ source: `judge-${i}`, target: 'case', label: 'Presided' });
    });
  }

  const defendant = metadata['Applicant / Plaintiff'] || metadata['Appellant'] || metadata['Respondent / Defendant'];
  if (defendant && typeof defendant === 'string') {
    nodes.push({ id: 'defendant', name: defendant, type: 'Entity' });
    edges.push({ source: 'defendant', target: 'case', label: 'Party' });
  }

  return (
    <PageShell
      title="Judicial Forensic Archive"
      subtitle={judgment.title}
      badge={metadata['Document Type'] || "Judgment"}
      badgeColor="blue"
      icon={<Gavel className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[
        { label: "Home", href: "/" }, 
        { label: "Justice", href: "/justice" }, 
        { label: "Corpus", href: "/justice/judgments" },
        { label: "Examine", href: "#" }
      ]}
      actions={
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <a 
            href={judgment.source_url} 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
          >
            <Globe className="w-3.5 h-3.5" /> View Original
          </a>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-12 pb-32">
        
        {/* TOP GRID: PRIMARY METADATA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Summary & Case Details */}
            <div className="lg:col-span-2 space-y-8">
                {linkedIncidents.length > 0 && (
                    <CaseLifecycle incident={linkedIncidents[0]} linkedJudgments={[judgment]} />
                )}
                <RelationshipGraph nodes={nodes} edges={edges} title="Judgment Relationship Mapping" />
                
                <section className="glass-card p-10 border-border-glass bg-bg-glass relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-blue mb-8 flex items-center gap-2">
                        <History className="w-4 h-4" /> AI_GENERATED_SYNOPSIS
                    </h3>
                    <p className="text-[15px] leading-relaxed text-foreground/80 italic font-light">
                        "{judgment.summary || "No automated summary available for this record."}"
                    </p>
                </section>

                <section className="space-y-6">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
                        <FileText className="w-4 h-4 text-accent-blue" /> Judgment Context
                    </h3>
                    <div className="glass-card p-1 border-border-glass bg-charcoal-3 overflow-hidden">
                        <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar bg-background/40">
                             <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-light text-muted-foreground leading-relaxed">
                                {judgment.content || "Content processing in progress..."}
                             </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right: Technical Metadata & Entities */}
            <div className="space-y-6">
                <div className="glass-card p-6 border-border-glass bg-bg-glass-heavy">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground mb-6 pb-4 border-b border-border-glass flex items-center gap-2">
                        <Scale className="w-4 h-4 text-accent-blue" /> Case Metadata
                    </h4>
                    <div className="space-y-4">
                        {[
                            { label: "Case Number", value: metadata['Case Number'], icon: Hash },
                            { label: "Court", value: metadata['Court'], icon: MapPin },
                            { label: "Judge(s)", value: metadata['Judges'] || metadata['Judge(s)'], icon: User },
                            { label: "Judgment Date", value: metadata['Judgment Date'] || metadata['Date'], icon: Calendar },
                        ].map((row, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <row.icon className="w-3 h-3 text-accent-blue/60" /> {row.label}
                                </div>
                                <div className="text-[12px] font-bold text-foreground">
                                    {Array.isArray(row.value) ? row.value.join(', ') : row.value || 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 border-border-glass bg-bg-glass">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-accent-gold" /> Classifiers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-accent-gold">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-4 h-4 text-accent-crimson" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Target Escalation</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 font-medium uppercase tracking-tighter">
                        This ruling contains high-fidelity forensic nodes.
                    </p>
                    <div className="space-y-3">
                        <button className="w-full py-3 bg-accent-crimson text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-all shadow-glow-crimson">
                            Trigger Deep Research
                        </button>
                        <CorroborationTrigger targetId={judgment.id} targetTitle={judgment.title} />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </PageShell>
  );
}

function Hash(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  )
}
