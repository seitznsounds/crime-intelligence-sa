"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { getDossiers, deleteDossier } from "@/app/admin/dossiers/actions";
import Link from "next/link";

interface DossierListPanelProps {
    onSelectEntity: (entity: any, mode: 'VIEW' | 'EDIT') => void;
}

export default function DossierListPanel({ onSelectEntity }: DossierListPanelProps) {
    const [dossiers, setDossiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDossiers();
    }, []);

    async function fetchDossiers() {
        setLoading(true);
        const data = await getDossiers();
        setDossiers(data.map(d => ({ ...d, type: 'dossier' })));
        setLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (confirm("Permanently delete this intelligence dossier?")) {
            setLoading(true);
            await deleteDossier(id);
            await fetchDossiers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => onSelectEntity({ _isNew: true, type: 'dossier', title: "New Dossier", content: "", slug: "" }, 'EDIT')}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
                >
                    <Plus className="w-3.5 h-3.5" /> Create New Dossier
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading && dossiers.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-card bg-bg-glass border-border-glass">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </div>
                ) : dossiers.map((d) => (
                    <div key={d.id} className="glass-card p-6 border-border-glass bg-bg-glass hover:border-accent-blue/30 transition-all flex flex-col justify-between group cursor-pointer" onClick={() => onSelectEntity(d, 'VIEW')}>
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); onSelectEntity(d, 'EDIT'); }} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }} className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold uppercase tracking-tight text-sm line-clamp-1">{d.title}</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">Last Updated: {new Date(d.updated_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}

                {dossiers.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center glass-card bg-bg-glass border-border-glass">
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No dossiers found in database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
