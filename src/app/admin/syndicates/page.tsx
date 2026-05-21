"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Search, Trash2, Edit3, Save, X, Activity, Loader2, Users, AlertTriangle, Scale, Briefcase } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getSyndicates, upsertSyndicate, deleteSyndicate, addAssetToSyndicate, searchPeople, addMemberToSyndicate } from "./actions";

const SECTORS = ["Extortion & Protection Rackets", "State Capture & Public Corruption", "Illicit Trade & Smuggling", "Narcotics Trafficking", "Organized Gang Warfare", "Money Laundering & Financial Crime", "Armed Robbery & CIT", "Organized Crime"];
const BASES = ["National", "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Mpumalanga", "Limpopo", "Transnational"];
const ASSET_TYPES = ["real_estate", "vehicle", "corporate_entity", "trust", "financial_account", "crypto_wallet"];
const LINK_TYPES = ["direct_owner", "beneficial_owner", "proxy_director", "operational_use"];

export default function SyndicateRegistry() {
  const [syndicates, setSyndicates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", sector: SECTORS[0], headquarters: BASES[0], description: "" });
  const [activeSyndicate, setActiveSyndicate] = useState<any | null>(null);

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [memberRole, setMemberRole] = useState("Associate");

  const [assetForm, setAssetForm] = useState({ asset_type: ASSET_TYPES[0], name_or_description: "", identifier: "", estimated_value: 0, link_type: LINK_TYPES[0] });

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
          calculated_risk: Math.round(autoRisk),
          members, crimes, courtCases,
          assets: s.assets || []
        };
    });

    setSyndicates(processed);
    if (activeSyndicate) {
        const updatedActive = processed.find(p => p.id === activeSyndicate.id);
        if (updatedActive) setActiveSyndicate(updatedActive);
    }
    setLoading(false);
  }

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setActiveSyndicate(s);
    setFormData({ name: s.name, sector: SECTORS.includes(s.sector) ? s.sector : SECTORS[0], headquarters: BASES.includes(s.headquarters) ? s.headquarters : BASES[0], description: s.description || "" });
  };

  const handleCreate = () => {
    setEditingId("NEW");
    setActiveSyndicate(null);
    setFormData({ name: "", sector: SECTORS[0], headquarters: BASES[0], description: "" });
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        await upsertSyndicate(editingId === "NEW" ? null : editingId, formData);
        setEditingId(null); setActiveSyndicate(null);
        await fetchData();
    } catch (e) { console.error(e); alert("Failed to update registry."); } finally { setLoading(false); }
  };

  // Search people handler
  useEffect(() => {
      const delay = setTimeout(async () => {
          if (searchQ.length > 2) {
              const res = await searchPeople(searchQ);
              setSearchResults(res);
          } else { setSearchResults([]); }
      }, 500);
      return () => clearTimeout(delay);
  }, [searchQ]);

  const handleLinkMember = async () => {
      if (!selectedPerson || !activeSyndicate) return;
      setLoading(true);
      await addMemberToSyndicate(activeSyndicate.id, selectedPerson.id, memberRole);
      setShowMemberModal(false); setSelectedPerson(null); setSearchQ("");
      await fetchData();
  };

  const handleLinkAsset = async () => {
      if (!activeSyndicate) return;
      setLoading(true);
      await addAssetToSyndicate(activeSyndicate.id, assetForm);
      setShowAssetModal(false); setAssetForm({ asset_type: ASSET_TYPES[0], name_or_description: "", identifier: "", estimated_value: 0, link_type: LINK_TYPES[0] });
      await fetchData();
  };

  return (
    <PageShell
      title="Syndicate Registry" subtitle="Operational control over organization nodes and criminal focus areas."
      badge="Intelligence Dashboard" badgeColor="crimson" icon={<ShieldAlert className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Syndicates", href: "/admin/syndicates" }]}
    >
      <div className="space-y-6">
        {editingId !== null ? (
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Edit Form */}
                <div className="glass-card p-6 border-border-glass bg-bg-glass-heavy space-y-6 xl:col-span-1 h-fit">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-accent-crimson">Node Configuration</h3>
                        <button onClick={() => {setEditingId(null); setActiveSyndicate(null)}} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Syndicate Name</label>
                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-accent-crimson outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sector / Focus</label>
                                <select value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-3 py-3 text-xs focus:border-accent-crimson outline-none transition-all appearance-none">
                                    {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Base</label>
                                <select value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} className="w-full bg-background border border-border-glass rounded-xl px-3 py-3 text-xs focus:border-accent-crimson outline-none transition-all appearance-none">
                                    {BASES.map(base => <option key={base} value={base}>{base}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Automated Threat Level</label>
                                <span className="text-[10px] font-mono font-bold text-accent-crimson bg-accent-crimson/10 px-2 py-0.5 rounded border border-accent-crimson/20">{activeSyndicate?.calculated_risk || 10}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                                <div className="h-full bg-accent-crimson transition-all duration-500" style={{ width: `${activeSyndicate?.calculated_risk || 10}%` }} />
                            </div>
                        </div>
                        <button onClick={handleSave} disabled={loading || !formData.name.trim()} className="w-full py-4 mt-4 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-glow-crimson hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit Configuration"}
                        </button>
                    </div>
                </div>

                {/* Intelligence Profile Dashboards */}
                {activeSyndicate && (
                    <div className="xl:col-span-2 space-y-6">
                        
                        {/* Known Members */}
                        <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Known Network Associates ({activeSyndicate.members.length})</h3>
                                </div>
                                <button onClick={() => setShowMemberModal(true)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent-crimson hover:text-white transition-colors">
                                    <Plus className="w-3 h-3" /> Add Link
                                </button>
                            </div>
                            <div className="p-4 max-h-[250px] overflow-y-auto">
                                {activeSyndicate.members.length === 0 ? (
                                    <div className="text-center py-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">No active members cataloged.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {activeSyndicate.members.map((m: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/50 hover:bg-white/5 transition-colors">
                                                <div>
                                                    <div className="font-bold text-xs">{m.name}</div>
                                                    <div className="text-[9px] uppercase tracking-widest text-accent-crimson mt-0.5">{m.role}</div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-mono font-bold">{m.risk}/10</span>
                                                    {m.tier && <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded mt-1 text-muted-foreground">TIER {m.tier}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Physical & Financial Assets */}
                        <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-amber-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Corporate & Physical Assets ({activeSyndicate.assets.length})</h3>
                                </div>
                                <button onClick={() => setShowAssetModal(true)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors">
                                    <Plus className="w-3 h-3" /> Link Asset
                                </button>
                            </div>
                            <div className="p-4 max-h-[200px] overflow-y-auto space-y-3">
                                {activeSyndicate.assets.length === 0 ? (
                                    <div className="text-center py-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No linked assets.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {activeSyndicate.assets.map((a: any, idx: number) => (
                                        <div key={idx} className="p-3 rounded-lg border border-white/5 bg-background/50 flex justify-between">
                                            <div>
                                                <div className="flex gap-2 items-center mb-1">
                                                    <div className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-widest font-black">{a.asset_type.replace('_', ' ')}</div>
                                                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground">{a.link_type.replace('_', ' ')}</div>
                                                </div>
                                                <div className="text-xs font-bold leading-snug">{a.name_or_description}</div>
                                                {a.identifier && <div className="text-[10px] font-mono text-muted-foreground mt-1">ID: {a.identifier}</div>}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-mono text-emerald-400">R {a.estimated_value?.toLocaleString() || 0}</div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Operational Footprint */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-accent-crimson" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Criminal Operations ({activeSyndicate.crimes.length})</h3>
                                </div>
                                <div className="p-4 max-h-[250px] overflow-y-auto space-y-3">
                                    {activeSyndicate.crimes.length === 0 ? (
                                        <div className="text-center py-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No linked incidents.</div>
                                    ) : (
                                        activeSyndicate.crimes.map((c: any, idx: number) => (
                                            <div key={idx} className="p-3 rounded-lg border border-white/5 bg-background/50">
                                                <div className="text-[9px] uppercase tracking-widest text-accent-crimson mb-1">{c.type}</div>
                                                <div className="text-xs font-bold leading-snug">{c.title}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Legal Exposure ({activeSyndicate.courtCases.length})</h3>
                                </div>
                                <div className="p-4 max-h-[250px] overflow-y-auto space-y-3">
                                    {activeSyndicate.courtCases.length === 0 ? (
                                        <div className="text-center py-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No legal exposure.</div>
                                    ) : (
                                        activeSyndicate.courtCases.map((c: any, idx: number) => (
                                            <div key={idx} className="p-3 rounded-lg border border-white/5 bg-background/50">
                                                <div className="text-[9px] uppercase tracking-widest text-blue-400 mb-1">{c.type}</div>
                                                <div className="text-xs font-bold leading-snug">{c.title}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
             </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
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
                            {syndicates.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 cursor-pointer" onClick={() => handleEdit(s)}>
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
                                            <button onClick={() => handleEdit(s)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={async (e) => { e.stopPropagation(); if(confirm("Sever this node?")) { setLoading(true); await deleteSyndicate(s.id); fetchData(); } }} className="p-2 hover:bg-crimson/10 rounded-lg text-muted-foreground hover:text-accent-crimson transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={handleCreate} className="w-full py-4 border-2 border-dashed border-border-glass rounded-3xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:border-accent-crimson hover:text-accent-crimson transition-all">+ Establish New Criminal Node</button>
            </div>
        )}

        {/* Member Link Modal */}
        {showMemberModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="glass-card bg-background max-w-md w-full p-6 space-y-6">
                    <div className="flex justify-between items-center"><h3 className="text-sm font-black uppercase tracking-widest">Link Known Associate</h3><button onClick={() => setShowMemberModal(false)}><X className="w-4 h-4" /></button></div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Database</label>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Type name..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="mt-2 border border-white/10 rounded-xl max-h-40 overflow-y-auto bg-black/50">
                                    {searchResults.map(r => (
                                        <button key={r.id} onClick={() => {setSelectedPerson(r); setSearchResults([]); setSearchQ(r.full_name);}} className="w-full text-left p-3 hover:bg-white/5 border-b border-white/5 text-xs font-bold">{r.full_name} <span className="text-[9px] text-muted-foreground ml-2 font-mono">RISK {r.risk_score}</span></button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedPerson && (
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role in Syndicate</label>
                                <input value={memberRole} onChange={e => setMemberRole(e.target.value)} placeholder="e.g. Enforcer, Frontman, Hitman" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
                            </div>
                        )}
                        <button onClick={handleLinkMember} disabled={!selectedPerson} className="w-full py-3 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50">Forge Link</button>
                    </div>
                </div>
            </div>
        )}

        {/* Asset Link Modal */}
        {showAssetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="glass-card bg-background max-w-md w-full p-6 space-y-6">
                    <div className="flex justify-between items-center"><h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Register Syndicate Asset</h3><button onClick={() => setShowAssetModal(false)}><X className="w-4 h-4" /></button></div>
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
                            <input value={assetForm.name_or_description} onChange={e => setAssetForm({...assetForm, name_or_description: e.target.value})} placeholder="e.g. Bosasa Operations, White Audi A4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reg / ID Number</label>
                                <input value={assetForm.identifier} onChange={e => setAssetForm({...assetForm, identifier: e.target.value})} placeholder="CIPC / License Plate" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Est. Value (ZAR)</label>
                                <input type="number" value={assetForm.estimated_value} onChange={e => setAssetForm({...assetForm, estimated_value: parseFloat(e.target.value)})} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none font-mono" />
                            </div>
                        </div>
                        
                        <button onClick={handleLinkAsset} disabled={!assetForm.name_or_description} className="w-full py-3 bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 mt-2">Register & Link Asset</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </PageShell>
  );
}
