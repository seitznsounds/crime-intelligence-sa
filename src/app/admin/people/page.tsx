"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, Trash2, Edit3, X, Loader2, ShieldAlert, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getPeople, upsertPerson, deletePerson, addAssetToPerson } from "./actions";

const ASSET_TYPES = ["real_estate", "vehicle", "corporate_entity", "trust", "financial_account", "crypto_wallet"];
const LINK_TYPES = ["direct_owner", "beneficial_owner", "proxy_director", "operational_use"];

export default function EntityController() {
  const [people, setPeople] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ full_name: "", role: "", pep_tier: 0, risk_score: 50, description: "", status: "active" });
  const [activePerson, setActivePerson] = useState<any | null>(null);

  // Asset Modal
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetForm, setAssetForm] = useState({ asset_type: ASSET_TYPES[0], name_or_description: "", identifier: "", estimated_value: 0, link_type: LINK_TYPES[1] });

  useEffect(() => {
    fetchData();
  }, [page, search]);

  async function fetchData() {
    setLoading(true);
    const result = await getPeople(search, page);
    setPeople(result.data);
    setTotal(result.total);
    if (activePerson) {
        const updatedActive = result.data.find((p: any) => p.id === activePerson.id);
        if (updatedActive) setActivePerson(updatedActive);
    }
    setLoading(false);
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setActivePerson(p);
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
        await upsertPerson(editingId === "NEW" ? null : editingId, formData);
        setEditingId(null);
        setActivePerson(null);
        await fetchData();
    } catch (e) {
        console.error(e);
        alert("Failed to update entity registry.");
    } finally {
        setLoading(false);
    }
  };

  const handleLinkAsset = async () => {
      if (!activePerson) return;
      setLoading(true);
      await addAssetToPerson(activePerson.id, assetForm);
      setShowAssetModal(false); 
      setAssetForm({ asset_type: ASSET_TYPES[0], name_or_description: "", identifier: "", estimated_value: 0, link_type: LINK_TYPES[1] });
      await fetchData();
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
        {editingId === null && (
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
                    onClick={() => { setEditingId("NEW"); setActivePerson(null); setFormData({ full_name: "", role: "", pep_tier: 0, risk_score: 50, description: "", status: "active" }); }}
                    className="px-6 py-2 bg-accent-gold text-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold"
                >
                    + Register New Entity
                </button>
            </div>
        )}

        {editingId !== null ? (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Configuration Panel */}
                <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy max-w-2xl w-full mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest text-accent-gold">Entity Configuration</h3>
                        <button onClick={() => {setEditingId(null); setActivePerson(null)}} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
                            <input 
                                value={formData.full_name}
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                                placeholder="Enter full name"
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
                                type="range" min="0" max="100"
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

                        <button onClick={handleSave} disabled={loading || !formData.full_name} className="w-full py-4 bg-accent-gold text-black text-[11px] font-black uppercase tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Identity to Registry"}
                        </button>
                    </div>
                </div>

                {/* Personal Assets Panel */}
                {activePerson && (
                    <div className="glass-card border-border-glass bg-bg-glass overflow-hidden max-w-2xl w-full mx-auto h-fit">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-amber-500" />
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Personal Wealth & Assets</h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Shell companies, real estate, and financial trusts linked to this identity.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAssetModal(true)} className="flex items-center gap-1 text-[10px] px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-white transition-colors">
                                <Plus className="w-3 h-3" /> Link Asset
                            </button>
                        </div>
                        <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                            {!activePerson.assets || activePerson.assets.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <Briefcase className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                    <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">No personal assets registered.</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                {activePerson.assets.map((a: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-background/50 flex justify-between items-center group hover:border-amber-500/30 transition-colors">
                                        <div>
                                            <div className="flex gap-2 items-center mb-1.5">
                                                <div className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-widest font-black">{a.asset_type.replace('_', ' ')}</div>
                                                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">{a.link_type.replace('_', ' ')}</div>
                                            </div>
                                            <div className="text-sm font-bold leading-snug">{a.name_or_description}</div>
                                            {a.identifier && <div className="text-[10px] font-mono text-muted-foreground mt-1">ID: {a.identifier}</div>}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono font-bold text-emerald-400">R {a.estimated_value?.toLocaleString() || 0}</div>
                                            <div className="text-[8px] uppercase tracking-widest text-muted-foreground mt-1">{a.status}</div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleEdit(p)}>
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
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button 
                                                onClick={async (e) => { e.stopPropagation(); if(confirm("Permanently erase this identity record?")) { setLoading(true); await deletePerson(p.id); fetchData(); } }}
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
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page {page} of {Math.ceil(total / 20) || 1}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="p-2 border border-border-glass rounded-lg hover:bg-white/5 disabled:opacity-20 transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>
        )}

        {/* Asset Link Modal */}
        {showAssetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="glass-card bg-background max-w-md w-full p-6 space-y-6 border-amber-500/20">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Register Personal Asset</h3>
                        <button onClick={() => setShowAssetModal(false)} className="text-muted-foreground hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Class</label>
                                <select value={assetForm.asset_type} onChange={e => setAssetForm({...assetForm, asset_type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none uppercase font-mono">
                                    {ASSET_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Link Type</label>
                                <select value={assetForm.link_type} onChange={e => setAssetForm({...assetForm, link_type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none uppercase font-mono">
                                    {LINK_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name / Description</label>
                            <input value={assetForm.name_or_description} onChange={e => setAssetForm({...assetForm, name_or_description: e.target.value})} placeholder="e.g. Bishopscourt Mansion, Trust Account" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reg / Title Deed / ID</label>
                                <input value={assetForm.identifier} onChange={e => setAssetForm({...assetForm, identifier: e.target.value})} placeholder="T4567/2021" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Est. Value (ZAR)</label>
                                <input type="number" value={assetForm.estimated_value} onChange={e => setAssetForm({...assetForm, estimated_value: parseFloat(e.target.value)})} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none font-mono" />
                            </div>
                        </div>
                        
                        <button onClick={handleLinkAsset} disabled={!assetForm.name_or_description || loading} className="w-full py-3 bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 mt-2 shadow-glow-amber hover:scale-[1.02] transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Register & Link Asset"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </PageShell>
  );
}
