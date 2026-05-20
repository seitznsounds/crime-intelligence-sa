"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Search, Trash2, Edit3, Save, X, Eye, ChevronLeft, Loader2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getDossiers, saveDossier, deleteDossier } from "./actions";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function DossierManager() {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", slug: "" });
  const [isPreview, setPreview] = useState(false);

  useEffect(() => {
    fetchDossiers();
  }, []);

  async function fetchDossiers() {
    setLoading(true);
    const data = await getDossiers();
    setDossiers(data);
    setLoading(false);
  }

  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setFormData({ 
        title: d.title, 
        content: d.content, 
        slug: d.metadata?.slug || "" 
    });
    setPreview(false);
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        await saveDossier(editingId, {
            title: formData.title,
            content: formData.content,
            metadata: { slug: formData.slug }
        });
        setEditingId(null);
        await fetchDossiers();
    } catch (e) {
        console.error(e);
        alert("Failed to save dossier.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this intelligence dossier?")) {
        setLoading(true);
        await deleteDossier(id);
        await fetchDossiers();
    }
  };

  return (
    <PageShell
      title="Dossier Manager"
      subtitle="Publish and edit deep intelligence profiles."
      badge="Intelligence Lifecycle"
      badgeColor="blue"
      icon={<FileText className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dossiers", href: "/admin/dossiers" }]}
      actions={
        <button 
            onClick={() => { setEditingId(null); setFormData({ title: "New Dossier", content: "", slug: "" }); }}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
        >
            <Plus className="w-3.5 h-3.5" /> Create New
        </button>
      }
    >
      <div className="space-y-6">
        {editingId !== null || formData.title === "New Dossier" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest text-accent-blue">Content Editor</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setPreview(!isPreview)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => {setEditingId(null); setFormData({title:"", content:"", slug:""})}} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Title</label>
                            <input 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-blue outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Forensic Narrative (Markdown)</label>
                            <textarea 
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                rows={15}
                                className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-xs font-mono focus:border-accent-blue outline-none transition-all resize-none"
                            />
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-4 bg-accent-blue text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-glow-blue hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Profile to Database"}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="glass-card p-8 border-border-glass bg-black/40 overflow-y-auto max-h-[700px] custom-scrollbar">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 border-b border-border-glass pb-4">Live Preview</h3>
                     <article className="prose prose-invert prose-xs max-w-none">
                        <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">{formData.title}</h1>
                        <ReactMarkdown>{formData.content}</ReactMarkdown>
                     </article>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dossiers.map((d) => (
                    <div key={d.id} className="glass-card p-6 border-border-glass bg-bg-glass hover:border-accent-blue/30 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(d)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDelete(d.id)} className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold uppercase tracking-tight text-sm line-clamp-1">{d.title}</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">Last Updated: {new Date(d.updated_at).toLocaleDateString()}</p>
                        </div>
                        <Link 
                            href={`/network`} // For now
                            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-accent-blue group-hover:text-white transition-colors"
                        >
                            View in Graph <ChevronLeft className="w-3 h-3 rotate-180" />
                        </Link>
                    </div>
                ))}

                {dossiers.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center glass-card bg-bg-glass border-border-glass">
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No dossiers found in database.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </PageShell>
  );
}
