"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, Trash2, Edit3, X, Activity, Loader2, ShieldAlert, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getPeople, upsertPerson, deletePerson } from "./actions";

export default function EntityController() {
  const [people, setPeople] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ full_name: "", role: "", pep_tier: 0, risk_score: 50, description: "", status: "active" });

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

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ 
        full_name: p.full_name, 
        role: p.role || "", 
        pep_tier: p.pep_tier || 0,
        risk_score: p.risk_score || 50,
        description: p.description || "",
        status: p.status || "active"
    });
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        await upsertPerson(editingId, formData);
        setEditingId(null);
        await fetchData();
    } catch (e) {
        console.error(e);
        alert("Failed to update entity registry.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageShell
      title="Entity Controller"
      subtitle="Modify high-risk PEP profiles and operative risk parameters."
      badge="Identity Management"
      badgeColor="gold"
      icon={<Users className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Entities", href: "/admin/people" }]}
    >
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
                onClick={() => { setEditingId(null); setFormData({ full_name: "NEW_ENTITY", role: "", pep_tier: 0, risk_score: 50, description: "", status: "active" }); }}
                className="px-6 py-2 bg-accent-gold text-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold"
            >
                + Register New Entity
            </button>
        </div>

        {editingId !== null || formData.full_name === "NEW_ENTITY" ? (
             <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-gold">Entity Configuration</h3>
                    <button onClick={() => {setEditingId(null); setFormData({full_name:"", role:"", pep_tier:0, risk_score:50, description:"", status:"active"})}} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
                        <input 
                            value={formData.full_name === "NEW_ENTITY" ? "" : formData.full_name}
                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                            className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Role</label>
                            <input 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                placeholder="e.g. Syndicate Leader, Attorney"
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">PEP Tier (0-3)</label>
                            <select 
                                value={formData.pep_tier}
                                onChange={e => setFormData({...formData, pep_tier: parseInt(e.target.value)})}
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value={0}>Non-PEP</option>
                                <option value={1}>Tier 1 (High Level)</option>
                                <option value={2}>Tier 2 (Influential)</option>
                                <option value={3}>Tier 3 (Local/Assoc)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Forensic Risk Score</label>
                            <span className="text-[9px] font-mono font-bold text-accent-crimson">{formData.risk_score}%</span>
                        </div>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={formData.risk_score}
                            onChange={e => setFormData({...formData, risk_score: parseInt(e.target.value)})}
                            className="w-full accent-accent-crimson"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Forensic Narrative / Background</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={4}
                            className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none transition-all resize-none"
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-accent-gold text-black text-[11px] font-black uppercase tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Identity to Registry"}
                    </button>
                </div>
             </div>
        ) : (
            <div className="space-y-4">
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
                            {people.map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold uppercase tracking-tight text-sm">{p.full_name}</div>
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
                                            <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button 
                                                onClick={async () => { if(confirm("Permanently erase this identity record?")) { setLoading(true); await deletePerson(p.id); fetchData(); } }}
                                                className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-6 pt-4 pb-20">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Page {page} of {Math.ceil(total / 20)}
                    </span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * 20 >= total}
                        className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </PageShell>
  );
}
