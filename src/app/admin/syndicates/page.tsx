"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Search, Trash2, Edit3, Save, X, Activity, Loader2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getSyndicates, upsertSyndicate, deleteSyndicate } from "./actions";

export default function SyndicateRegistry() {
  const [syndicates, setSyndicates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", sector: "", headquarters: "", description: "", risk_score: 50 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const data = await getSyndicates();
    setSyndicates(data);
    setLoading(false);
  }

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setFormData({ 
        name: s.name, 
        sector: s.sector || "", 
        headquarters: s.headquarters || "",
        description: s.description || "",
        risk_score: s.risk_score || 50
    });
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        await upsertSyndicate(editingId, formData);
        setEditingId(null);
        await fetchData();
    } catch (e) {
        console.error(e);
        alert("Failed to update registry.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageShell
      title="Syndicate Registry"
      subtitle="Operational control over organization nodes and criminal focus areas."
      badge="Node Control"
      badgeColor="crimson"
      icon={<ShieldAlert className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Syndicates", href: "/admin/syndicates" }]}
    >
      <div className="space-y-6">
        {editingId !== null || formData.name === "NEW_NODE" ? (
             <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-crimson">Node Configuration</h3>
                    <button onClick={() => {setEditingId(null); setFormData({name:"", sector:"", headquarters:"", description:"", risk_score:50})}} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Syndicate Name</label>
                            <input 
                                value={formData.name === "NEW_NODE" ? "" : formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sector / Focus</label>
                            <input 
                                value={formData.sector}
                                onChange={e => setFormData({...formData, sector: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Base</label>
                        <input 
                            value={formData.headquarters}
                            onChange={e => setFormData({...formData, headquarters: e.target.value})}
                            className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Risk Score</label>
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
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Forensic Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={4}
                            className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-xs focus:border-accent-crimson outline-none transition-all resize-none"
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-glow-crimson hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Node to Registry"}
                    </button>
                </div>
             </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-border-glass">
                            <tr>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Syndicate Name</th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Operational Sector</th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Risk</th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {syndicates.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold uppercase tracking-tight text-sm">{s.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">{s.headquarters || 'UNKNOWN BASE'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-accent-crimson/10 border border-accent-crimson/20 rounded text-[8px] font-black uppercase tracking-widest text-accent-crimson">
                                            {s.sector || 'Organized Crime'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-crimson" style={{ width: `${s.risk_score}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold">{s.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(s)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button 
                                                onClick={async () => { if(confirm("Sever this node from registry?")) { setLoading(true); await deleteSyndicate(s.id); fetchData(); } }}
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
                
                <button 
                    onClick={() => setFormData({...formData, name: "NEW_NODE"})}
                    className="w-full py-4 border-2 border-dashed border-border-glass rounded-3xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:border-accent-crimson hover:text-accent-crimson transition-all"
                >
                    + Establish New Criminal Node
                </button>
            </div>
        )}
      </div>
    </PageShell>
  );
}
