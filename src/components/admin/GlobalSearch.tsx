"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Users, ShieldAlert, FileText, ArrowRight } from "lucide-react";
import { globalSearch } from "@/app/admin/actions";

interface GlobalSearchProps {
    onSelectEntity: (entity: any, mode: 'VIEW' | 'EDIT') => void;
}

export default function GlobalSearch({ onSelectEntity }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ people: any[], orgs: any[], dossiers: any[] }>({ people: [], orgs: [], dossiers: [] });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                const data = await globalSearch(query);
                setResults(data);
                setLoading(false);
                setOpen(true);
            } else {
                setResults({ people: [], orgs: [], dossiers: [] });
                setOpen(false);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [query]);

    const handleSelect = (entity: any, type: string) => {
        setOpen(false);
        setQuery("");
        onSelectEntity({ ...entity, type }, 'VIEW');
    };

    return (
        <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input 
                placeholder="Global Search: Enter entity name, syndicate, or dossier..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => { if (query.length > 2) setOpen(true); }}
                className="w-full bg-background/50 border border-border-glass rounded-2xl py-3 pl-12 pr-10 text-sm focus:border-accent-blue outline-none transition-all"
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />}

            {open && (results.people.length > 0 || results.orgs.length > 0 || results.dossiers.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-glass rounded-2xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                    {results.people.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-accent-gold flex items-center gap-2"><Users className="w-3 h-3" /> People</div>
                            {results.people.map(p => (
                                <button key={p.id} onClick={() => handleSelect(p, 'person')} className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 flex justify-between items-center group">
                                    <div>
                                        <div className="text-sm font-bold">{p.full_name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase">{p.role || 'Unknown'}</div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                    {results.orgs.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-accent-crimson flex items-center gap-2"><ShieldAlert className="w-3 h-3" /> Syndicates</div>
                            {results.orgs.map(o => (
                                <button key={o.id} onClick={() => handleSelect(o, 'syndicate')} className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 flex justify-between items-center group">
                                    <div>
                                        <div className="text-sm font-bold">{o.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase">{o.sector}</div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                    {results.dossiers.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-accent-blue flex items-center gap-2"><FileText className="w-3 h-3" /> Dossiers</div>
                            {results.dossiers.map(d => (
                                <button key={d.id} onClick={() => handleSelect(d, 'dossier')} className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 flex justify-between items-center group">
                                    <div className="text-sm font-bold">{d.title}</div>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
