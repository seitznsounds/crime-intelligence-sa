import { fetchAllJudgments } from "@/lib/intelligence-actions";
import PageShell from "@/components/layout/PageShell";
import { Scale, Search, Calendar, MapPin, ChevronRight, FileText, Gavel, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JudgmentsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1");
  const { data: judgments, total, error } = await fetchAllJudgments(page);

  return (
    <PageShell
      title="Judicial Intelligence Corpus"
      subtitle="Examine authoritative criminal judgments extracted from high court archives. Forensics for the public interest."
      badge="Legal Intelligence"
      badgeColor="blue"
      icon={<Scale className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Justice", href: "/justice" }, { label: "Judgments", href: "/justice/judgments" }]}
      actions={
        <Link 
            href="/justice/heatmap" 
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
        >
            <Globe className="w-4 h-4" /> Visualise Heatmap
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Search / Filter Bar */}
        <div className="glass-card p-6 border-border-glass bg-bg-glass flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search by judge, case number, or keyword..."
                    className="w-full pl-12 pr-4 py-3 bg-charcoal-3 border border-border-glass rounded-xl text-sm focus:border-accent-blue transition-all outline-none"
                />
            </div>
            <div className="flex gap-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">{total} Records Indexed</span>
            </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {judgments.map((item) => (
                <div key={item.id} className="glass-card p-8 border-border-glass bg-bg-glass hover:bg-bg-glass-heavy hover:border-accent-blue/30 transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-accent-blue/10 rounded-2xl border border-accent-blue/20">
                            <Gavel className="w-5 h-5 text-accent-blue" />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase border border-border-glass px-2 py-1 rounded">
                            {item.metadata?.['Case Number'] || 'UNREPORTED'}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight text-foreground mb-4 line-clamp-2">
                        {item.title}
                    </h3>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="font-bold uppercase tracking-widest">{new Date(item.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-bold uppercase tracking-widest">{item.metadata?.['Court'] || 'High Court'}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-border-glass flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {item.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-muted-foreground">{tag}</span>
                            ))}
                        </div>
                        <Link 
                            href={`/justice/judgments/${item.id}`}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue group-hover:translate-x-1 transition-transform"
                        >
                            Examine Dossier <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 pt-12 pb-32">
            <Link 
                href={`?page=${Math.max(1, page - 1)}`}
                className={`px-6 py-3 border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${page === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-white/5'}`}
            >
                Previous
            </Link>
            <div className="flex items-center px-6 border border-border-glass rounded-xl text-[11px] font-mono text-accent-blue">
                PAGE {page}
            </div>
            <Link 
                href={`?page=${page + 1}`}
                className="px-6 py-3 border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
                Next
            </Link>
        </div>
      </div>
    </PageShell>
  );
}
