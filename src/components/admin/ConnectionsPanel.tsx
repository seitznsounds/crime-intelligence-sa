"use client";

import { useState, useEffect } from "react";
import { Trash2, ArrowRight, Loader2, Users, ShieldAlert, X } from "lucide-react";
import { getNodes, getConnections, createRelationship, createOrgLink, deleteRelationship, deleteOrgLink } from "@/app/admin/connections/actions";

export default function ConnectionsPanel() {
    const [nodes, setNodes] = useState<{people: any[], orgs: any[]}>({ people: [], orgs: [] });
    const [connections, setConnections] = useState<{relationships: any[], orgLinks: any[]}>({ relationships: [], orgLinks: [] });
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'VIEW' | 'CREATE_REL' | 'CREATE_LINK'>('VIEW');
    
    const [relForm, setRelRelForm] = useState({ source_id: "", target_id: "", type: "associate", confidence: 80, evidence: "" });
    const [linkForm, setLinkForm] = useState({ person_id: "", org_id: "", role: "OPERATIVE", confidence: 80 });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const [nodeData, connData] = await Promise.all([getNodes(), getConnections()]);
        setNodes(nodeData);
        setConnections(connData);
        setLoading(false);
    }

    const handleCreateRel = async () => {
        if (!relForm.source_id || !relForm.target_id) return alert("Select source and target.");
        try {
            setLoading(true);
            await createRelationship(relForm);
            setMode('VIEW');
            await fetchData();
        } catch (e) { console.error(e); alert("Failed."); } finally { setLoading(false); }
    };

    const handleCreateLink = async () => {
        if (!linkForm.person_id || !linkForm.org_id) return alert("Select person and organization.");
        try {
            setLoading(true);
            await createOrgLink(linkForm);
            setMode('VIEW');
            await fetchData();
        } catch (e) { console.error(e); alert("Failed."); } finally { setLoading(false); }
    };

    if (mode !== 'VIEW') {
        return (
            <div className="max-w-2xl mx-auto glass-card p-8 border-border-glass bg-bg-glass-heavy space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-emerald">Forging New Link</h3>
                    <button onClick={() => setMode('VIEW')} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>

                {mode === 'CREATE_REL' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Source Person</label>
                            <select 
                                value={relForm.source_id} 
                                onChange={e => setRelRelForm({...relForm, source_id: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm"
                            >
                                <option value="">Select...</option>
                                {nodes.people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Person</label>
                            <select 
                                value={relForm.target_id} 
                                onChange={e => setRelRelForm({...relForm, target_id: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm"
                            >
                                <option value="">Select...</option>
                                {nodes.people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Relationship Type</label>
                                <input value={relForm.type} onChange={e => setRelRelForm({...relForm, type: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confidence ({relForm.confidence}%)</label>
                                <input type="range" min="0" max="100" value={relForm.confidence} onChange={e => setRelRelForm({...relForm, confidence: parseInt(e.target.value)})} className="w-full accent-accent-gold" />
                            </div>
                        </div>
                        <button onClick={handleCreateRel} disabled={loading} className="w-full py-4 bg-accent-gold text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Alliance to Graph"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Person</label>
                            <select 
                                value={linkForm.person_id} 
                                onChange={e => setLinkForm({...linkForm, person_id: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm"
                            >
                                <option value="">Select...</option>
                                {nodes.people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization / Syndicate</label>
                            <select 
                                value={linkForm.org_id} 
                                onChange={e => setLinkForm({...linkForm, org_id: e.target.value})}
                                className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm"
                            >
                                <option value="">Select...</option>
                                {nodes.orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role in Org</label>
                                <input value={linkForm.role} onChange={e => setLinkForm({...linkForm, role: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl p-3 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confidence ({linkForm.confidence}%)</label>
                                <input type="range" min="0" max="100" value={linkForm.confidence} onChange={e => setLinkForm({...linkForm, confidence: parseInt(e.target.value)})} className="w-full accent-accent-crimson" />
                            </div>
                        </div>
                        <button onClick={handleCreateLink} disabled={loading} className="w-full py-4 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-glow-crimson">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Membership to Graph"}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => setMode('CREATE_REL')}
                    className="p-8 glass-card border-border-glass bg-bg-glass hover:border-accent-gold/40 transition-all text-center group"
                >
                    <Users className="w-8 h-8 text-accent-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-gold">Link Person to Person</h3>
                </button>
                <button 
                    onClick={() => setMode('CREATE_LINK')}
                    className="p-8 glass-card border-border-glass bg-bg-glass hover:border-accent-crimson/40 transition-all text-center group"
                >
                    <ShieldAlert className="w-8 h-8 text-accent-crimson mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-crimson">Link Person to Syndicate</h3>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Relationship Table */}
                <div className="glass-card border-border-glass bg-bg-glass overflow-hidden flex flex-col">
                    <div className="p-4 bg-white/5 border-b border-border-glass font-black text-[9px] uppercase tracking-widest">Inter-Personal Alliances</div>
                    <div className="flex-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-white/5">
                                {connections.relationships.map(r => (
                                    <tr key={r.id} className="hover:bg-white/[0.02]">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold">{r.source_person?.full_name}</span>
                                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs font-bold">{r.target_person?.full_name}</span>
                                            </div>
                                            <div className="text-[9px] font-mono uppercase text-accent-gold mt-1">{r.relationship_type}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => deleteRelationship(r.id).then(fetchData)} className="p-2 hover:text-accent-crimson transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Org Links Table */}
                <div className="glass-card border-border-glass bg-bg-glass overflow-hidden flex flex-col">
                    <div className="p-4 bg-white/5 border-b border-border-glass font-black text-[9px] uppercase tracking-widest">Organizational Memberships</div>
                    <div className="flex-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-white/5">
                                {connections.orgLinks.map(l => (
                                    <tr key={l.id} className="hover:bg-white/[0.02]">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold">{l.people?.full_name}</span>
                                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs font-bold">{l.organizations?.name}</span>
                                            </div>
                                            <div className="text-[9px] font-mono uppercase text-accent-crimson mt-1">{l.role}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => deleteOrgLink(l.id).then(fetchData)} className="p-2 hover:text-accent-crimson transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
