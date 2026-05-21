"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, Users, ShieldAlert, FileText, Briefcase, AlertTriangle, Scale, Link as LinkIcon, Eye } from "lucide-react";
import { upsertPerson } from "@/app/admin/people/actions";
import { upsertSyndicate } from "@/app/admin/syndicates/actions";
import { saveDossier } from "@/app/admin/dossiers/actions";
import ReactMarkdown from 'react-markdown';

interface EntityContextPanelProps {
    entity: any;
    mode: 'VIEW' | 'EDIT';
    onClose: () => void;
    onSaved: () => void;
}

export default function EntityContextPanel({ entity, mode: initialMode, onClose, onSaved }: EntityContextPanelProps) {
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [personForm, setPersonForm] = useState({ full_name: "", role: "", pep_tier: 0, risk_score: 50, description: "", status: "active" });
    const [syndicateForm, setSyndicateForm] = useState({ name: "", sector: "Organized Crime", headquarters: "National", description: "" });
    const [dossierForm, setDossierForm] = useState({ title: "", content: "", slug: "" });
    
    const [isPreview, setPreview] = useState(false);

    useEffect(() => {
        setMode(initialMode);
        if (entity.type === 'person') {
            setPersonForm({
                full_name: entity.full_name || "",
                role: entity.role || "",
                pep_tier: entity.pep_tier || 0,
                risk_score: entity.risk_score || 50,
                description: entity.description || "",
                status: entity.status || "active"
            });
        } else if (entity.type === 'syndicate') {
            setSyndicateForm({
                name: entity.name || "",
                sector: entity.sector || "Organized Crime",
                headquarters: entity.headquarters || "National",
                description: entity.description || ""
            });
        } else if (entity.type === 'dossier') {
            setDossierForm({
                title: entity.title || "",
                content: entity.content || "",
                slug: entity.metadata?.slug || ""
            });
            setPreview(false);
        }
    }, [entity, initialMode]);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (entity.type === 'person') {
                await upsertPerson(entity._isNew ? null : entity.id, personForm);
            } else if (entity.type === 'syndicate') {
                await upsertSyndicate(entity._isNew ? null : entity.id, syndicateForm);
            } else if (entity.type === 'dossier') {
                await saveDossier(entity._isNew ? null : entity.id, {
                    title: dossierForm.title,
                    content: dossierForm.content,
                    metadata: { slug: dossierForm.slug }
                });
            }
            onSaved();
        } catch (e) {
            console.error(e);
            alert("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'EDIT' || entity._isNew) {
        return (
            <div className="glass-card p-6 border-border-glass bg-bg-glass-heavy space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-blue">
                        {entity._isNew ? `Create New ${entity.type}` : `Edit ${entity.type}`}
                    </h3>
                    <div className="flex gap-2">
                        {entity.type === 'dossier' && (
                            <button onClick={() => setPreview(!isPreview)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><Eye className="w-4 h-4" /></button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                    </div>
                </div>

                {entity.type === 'person' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
                            <input value={personForm.full_name} onChange={e => setPersonForm({...personForm, full_name: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Role</label>
                                <input value={personForm.role} onChange={e => setPersonForm({...personForm, role: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">PEP Tier (0-3)</label>
                                <select value={personForm.pep_tier} onChange={e => setPersonForm({...personForm, pep_tier: parseInt(e.target.value)})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none">
                                    <option value={0}>Non-PEP</option><option value={1}>Tier 1</option><option value={2}>Tier 2</option><option value={3}>Tier 3</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Risk Score ({personForm.risk_score}%)</label>
                            <input type="range" min="0" max="100" value={personForm.risk_score} onChange={e => setPersonForm({...personForm, risk_score: parseInt(e.target.value)})} className="w-full accent-accent-crimson" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Narrative</label>
                            <textarea value={personForm.description} onChange={e => setPersonForm({...personForm, description: e.target.value})} rows={4} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none resize-none" />
                        </div>
                    </div>
                )}

                {entity.type === 'syndicate' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Syndicate Name</label>
                            <input value={syndicateForm.name} onChange={e => setSyndicateForm({...syndicateForm, name: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sector</label>
                            <input value={syndicateForm.sector} onChange={e => setSyndicateForm({...syndicateForm, sector: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none" />
                        </div>
                    </div>
                )}

                {entity.type === 'dossier' && (
                    <div className="space-y-4">
                        {isPreview ? (
                            <article className="prose prose-invert prose-xs max-w-none">
                                <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">{dossierForm.title}</h1>
                                <ReactMarkdown>{dossierForm.content}</ReactMarkdown>
                            </article>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                                    <input value={dossierForm.title} onChange={e => setDossierForm({...dossierForm, title: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-blue outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Narrative (Markdown)</label>
                                    <textarea value={dossierForm.content} onChange={e => setDossierForm({...dossierForm, content: e.target.value})} rows={15} className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-xs font-mono focus:border-accent-blue outline-none resize-none" />
                                </div>
                            </>
                        )}
                    </div>
                )}

                <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-accent-blue text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 mt-4">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                </button>
            </div>
        );
    }

    // VIEW MODE
    return (
        <div className="glass-card p-6 border-border-glass bg-bg-glass-heavy space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {entity.type === 'person' && <Users className="w-4 h-4 text-accent-gold" />}
                        {entity.type === 'syndicate' && <ShieldAlert className="w-4 h-4 text-accent-crimson" />}
                        {entity.type === 'dossier' && <FileText className="w-4 h-4 text-accent-blue" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entity.type}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                        {entity.full_name || entity.name || entity.title}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setMode('EDIT')} className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Edit</button>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Entity specific viewing details */}
            {entity.description && (
                <div className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap bg-background/50 p-4 rounded-xl border border-white/5">
                    {entity.description}
                </div>
            )}

            {entity.type === 'person' && entity.assets && entity.assets.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Linked Assets</h4>
                    {entity.assets.map((a: any, i: number) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                            <span className="font-bold">{a.name_or_description}</span>
                            <div className="text-[10px] text-muted-foreground uppercase mt-1">{a.asset_type.replace('_', ' ')} • {a.link_type.replace('_', ' ')}</div>
                        </div>
                    ))}
                </div>
            )}

            {entity.type === 'syndicate' && entity.members && entity.members.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-crimson flex items-center gap-2"><Users className="w-3 h-3" /> Known Members</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {entity.members.map((m: any, i: number) => (
                            <div key={i} className="p-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold">
                                {m.name}
                                <span className="block text-muted-foreground uppercase font-normal text-[9px] mt-0.5">{m.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {entity.type === 'dossier' && entity.content && (
                <article className="prose prose-invert prose-xs max-w-none">
                    <ReactMarkdown>{entity.content}</ReactMarkdown>
                </article>
            )}

            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                <button onClick={() => setMode('EDIT')} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center hover:bg-white/10 transition-colors">
                    Update Details
                </button>
            </div>
        </div>
    );
}
