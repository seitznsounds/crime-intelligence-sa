"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, Trash2, Edit3, Loader2, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { getPeople, deletePerson } from "@/app/admin/people/actions";

interface EntityListPanelProps {
    onSelectEntity: (entity: any, mode: 'VIEW' | 'EDIT') => void;
}

export default function EntityListPanel({ onSelectEntity }: EntityListPanelProps) {
    const [people, setPeople] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    async function fetchData() {
        setLoading(true);
        const result = await getPeople(search, page);
        setPeople(result.data);
        setTotal(result.total);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 border-border-glass bg-bg-glass">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input 
                        placeholder="Search entities by name..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-background/50 border border-border-glass rounded-xl py-2 pl-10 pr-4 text-sm focus:border-accent-gold outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={() => onSelectEntity({ _isNew: true, type: 'person' }, 'EDIT')}
                    className="px-6 py-2 bg-accent-gold text-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold"
                >
                    + Register New Entity
                </button>
            </div>

            <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-border-glass">
                        <tr>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Entity Name</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Classification</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Risk</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && people.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : (
                            people.map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => onSelectEntity({ ...p, type: 'person' }, 'VIEW')}>
                                    <td className="p-4">
                                        <div className="font-bold uppercase tracking-tight text-sm flex items-center gap-2">
                                            {p.full_name}
                                            {p.assets && p.assets.length > 0 && (
                                                <span className="flex items-center gap-1 text-[9px] font-mono bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                    <Briefcase className="w-3 h-3"/> {p.assets.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">{p.role || 'UNDETERMINED ROLE'}</div>
                                    </td>
                                    <td className="p-4">
                                        {p.pep_tier > 0 ? (
                                            <span className="px-2 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded text-[8px] font-black uppercase tracking-widest text-accent-gold">
                                                PEP TIER {p.pep_tier}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                                CIVILIAN / OPERATIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-crimson" style={{ width: `${p.risk_score}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold">{p.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); onSelectEntity({ ...p, type: 'person' }, 'EDIT'); }} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button 
                                                onClick={async (e) => { e.stopPropagation(); if(confirm("Permanently erase this identity record?")) { setLoading(true); await deletePerson(p.id); fetchData(); } }}
                                                className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-6 pt-4 pb-20">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page {page} of {Math.ceil(total / 20) || 1}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total || total === 0} className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>
    );
}
