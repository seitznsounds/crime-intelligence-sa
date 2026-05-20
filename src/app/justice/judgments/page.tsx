import { fetchAllJudgments } from "@/lib/intelligence-actions";
import PageShell from "@/components/layout/PageShell";
import { Scale, Calendar, MapPin, ChevronRight, Gavel, Globe, Info, Heart, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";
import WhatNext from "@/components/layout/WhatNext";
import JudgmentFilters from "./JudgmentFilters";

export const dynamic = "force-dynamic";

export default async function JudgmentsPage({ searchParams }: { searchParams: Promise<{ page?: string, query?: string, category?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const query = params.query || "";
  const category = params.category || "";
  
  const { data: judgments, total, error } = await fetchAllJudgments(page, 20, { query, category });

  return (
    <PageShell
      title="Court Rulings"
      subtitle="Read real court judgments from major corruption and organized crime cases in South Africa."
      badge="Court Cases"
      badgeColor="blue"
      icon={<Scale className="w-6 h-6 text-accent-blue" />}
      guidance="Browse actual court documents and rulings. You can filter by category or search for specific cases to see how the justice system has handled corruption."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore", href: "/justice" }, { label: "Court Rulings", href: "/justice/judgments" }]}
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
        <JudgmentFilters />

        <div className="flex items-center gap-2 px-4">
            <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">{total} Records Found</span>
            {(query || category) && (
                <span className="text-[10px] font-bold text-accent-blue uppercase font-mono px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full">Filtering Active</span>
            )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
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

                    <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-4 line-clamp-2 min-h-[3.5rem]">
                        {item.title}
                    </h3>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-accent-blue/60" />
                            <span className="font-bold uppercase tracking-widest">{new Date(item.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-accent-blue/60" />
                            <span className="font-bold uppercase tracking-widest">{item.metadata?.['Court'] || 'High Court'}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {item.tags?.slice(0, 1).map((tag: string) => (
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

            {judgments.length === 0 && (
                <div className="col-span-full py-32 text-center space-y-4 glass-card bg-bg-glass border-border-glass">
                    <Info className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-sm text-muted-foreground uppercase font-black tracking-widest">No matching judgments found in forensic archive.</p>
                </div>
            )}
        </div>

        {/* Pagination */}
        {total > 20 && (
            <div className="flex justify-center gap-4 pt-12 pb-32">
                <Link 
                    href={`?page=${Math.max(1, page - 1)}${query ? `&query=${query}` : ''}${category ? `&category=${category}` : ''}`}
                    className={`px-6 py-3 border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${page === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-white/5'}`}
                >
                    Previous
                </Link>
                <div className="flex items-center px-6 border border-border-glass rounded-xl text-[11px] font-mono text-accent-blue">
                    PAGE {page}
                </div>
                <Link 
                    href={`?page=${page + 1}${query ? `&query=${query}` : ''}${category ? `&category=${category}` : ''}`}
                    className={`px-6 py-3 border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all ${judgments.length < 20 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                    Next
                </Link>
            </div>
        )}
      </div>

      <WhatNext suggestions={[
        { title: "Honouring Victims", description: "Read the stories of victims of political violence.", href: "/victims", icon: "Heart" },
        { title: "Unpunished Perpetrators", description: "See who has committed crimes but avoided justice.", href: "/accountability", icon: "ShieldAlert" },
        { title: "Anti-Corruption Tracker", description: "Track progress on legal reforms.", href: "/anticorruption", icon: "Award" },
      ]} />
    </PageShell>
  );
}
