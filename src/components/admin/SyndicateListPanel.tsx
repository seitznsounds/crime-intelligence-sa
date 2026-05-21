"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Trash2, Edit3, Loader2, Users, Briefcase } from "lucide-react";
import { getSyndicates, deleteSyndicate } from "@/app/admin/syndicates/actions";

interface SyndicateListPanelProps {
    onSelectEntity: (entity: any, mode: 'VIEW' | 'EDIT') => void;
}

export default function SyndicateListPanel({ onSelectEntity }: SyndicateListPanelProps) {
    const [syndicates, setSyndicates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        const rawData = await getSyndicates();
        
        const processed = rawData.map(s => {
            let memberCount = 0;
            let totalRisk = 0;
            const members: any[] = [];
            const crimes: any[] = [];
            const courtCases: any[] = [];
        
            if (s.person_org_links) {
              s.person_org_links.forEach((link: any) => {
                if (link.people) {
                  memberCount++;
                  const pRisk = link.people.risk_score || 1;
                  totalRisk += pRisk;
                  
                  members.push({ id: link.people.id, name: link.people.full_name, role: link.role || 'Associate', risk: pRisk, tier: link.people.pep_tier });
        
                  if (link.people.person_incident_links) {
                    link.people.person_incident_links.forEach((il: any) => {
                      if (il.incidents) {
                        const inc = il.incidents;
                        const isLegal = inc.type?.toLowerCase().includes('court') || inc.type?.toLowerCase().includes('judgement') || inc.type?.toLowerCase().includes('commission');
                        if (isLegal) {
                          if (!courtCases.find(c => c.id === inc.id)) courtCases.push(inc);
                        } else {
                          if (!crimes.find(c => c.id === inc.id)) crimes.push(inc);
                        }
                      }
                    });
                  }
                }
              });
            }
            
            let autoRisk = memberCount > 0 ? (totalRisk / memberCount) * 10 : 10;
            autoRisk += (memberCount * 2);
            if (autoRisk > 100) autoRisk = 100;
            if (autoRisk < 0) autoRisk = 0;
        
            return {
              ...s,
              type: 'syndicate',
              calculated_risk: Math.round(autoRisk),
              members, crimes, courtCases,
              assets: s.assets || []
            };
        });
    
        setSyndicates(processed);
        setLoading(false);
    }

    return (
        <div className="space-y-4">
            <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-border-glass">
                        <tr>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Syndicate Name</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Operational Sector</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Threat Risk</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && syndicates.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : (
                            syndicates.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 cursor-pointer" onClick={() => onSelectEntity(s, 'VIEW')}>
                                        <div className="font-bold uppercase tracking-tight text-sm flex items-center gap-2">
                                            {s.name}
                                            <div className="flex gap-1">
                                                <span className="flex items-center gap-1 text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded"><Users className="w-3 h-3 text-muted-foreground"/> {s.members.length}</span>
                                                {s.assets.length > 0 && <span className="flex items-center gap-1 text-[9px] font-mono bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded"><Briefcase className="w-3 h-3 text-amber-500"/> {s.assets.length}</span>}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">{s.headquarters || 'UNKNOWN BASE'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-accent-crimson/10 border border-accent-crimson/20 rounded text-[8px] font-black uppercase tracking-widest text-accent-crimson">{s.sector || 'Organized Crime'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-crimson" style={{ width: `${s.calculated_risk}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold">{s.calculated_risk}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onSelectEntity(s, 'EDIT')} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={async (e) => { e.stopPropagation(); if(confirm("Sever this node?")) { setLoading(true); await deleteSyndicate(s.id); fetchData(); } }} className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <button onClick={() => onSelectEntity({ _isNew: true, type: 'syndicate' }, 'EDIT')} className="w-full py-4 border-2 border-dashed border-border-glass rounded-3xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:border-accent-crimson hover:text-accent-crimson transition-all">+ Establish New Criminal Node</button>
        </div>
    );
}
