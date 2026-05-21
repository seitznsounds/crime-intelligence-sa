"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Activity, Settings, Loader2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { getInvestigationData } from "./actions";

import InvestigationTabs from "@/components/admin/InvestigationTabs";
import GlobalSearch from "@/components/admin/GlobalSearch";
import EntityContextPanel from "@/components/admin/EntityContextPanel";

// Tab Panels
import ReportQueuePanel from "@/components/admin/ReportQueuePanel";
import EntityListPanel from "@/components/admin/EntityListPanel";
import SyndicateListPanel from "@/components/admin/SyndicateListPanel";
import ConnectionsPanel from "@/components/admin/ConnectionsPanel";
import DossierListPanel from "@/components/admin/DossierListPanel";
import { useSearchParams } from "next/navigation";

function InvestigationHubContent() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "reports";
    
    const [stats, setStats] = useState({ dossiers: 0, syndicates: 0, entities: 0, health: "98%" });
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
    const [contextMode, setContextMode] = useState<'VIEW' | 'EDIT'>('VIEW');

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getInvestigationData();
            setStats(data.stats);
            setPendingCount(data.pendingCount);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSelectEntity = (entity: any, mode: 'VIEW' | 'EDIT') => {
        setSelectedEntity(entity);
        setContextMode(mode);
    };

    const handleContextClose = () => {
        setSelectedEntity(null);
    };

    const handleContextSaved = () => {
        setSelectedEntity(null);
        loadData();
    };

    return (
        <PageShell
            title="Investigation Hub"
            subtitle="Centralised command center for entities, networks, dossiers, and citizen intelligence."
            badge="Admin Terminal"
            badgeColor="blue"
            icon={<Settings className="w-6 h-6 text-accent-blue" />}
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin Hub", href: "/admin" }]}
            actions={<GlobalSearch onSelectEntity={handleSelectEntity} />}
        >
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-card p-4 border-border-glass bg-bg-glass text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Active Dossiers</span>
                        <span className="text-xl font-black text-accent-blue">{stats.dossiers}</span>
                    </div>
                    <div className="glass-card p-4 border-border-glass bg-bg-glass text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Syndicates</span>
                        <span className="text-xl font-black text-accent-crimson">{stats.syndicates}</span>
                    </div>
                    <div className="glass-card p-4 border-border-glass bg-bg-glass text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Tracked Entities</span>
                        <span className="text-xl font-black text-accent-gold">{stats.entities}</span>
                    </div>
                    <div className="glass-card p-4 border-border-glass bg-bg-glass text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Pending Reports</span>
                        <span className="text-xl font-black text-white">{pendingCount}</span>
                    </div>
                </div>

                <InvestigationTabs pendingCount={pendingCount} />

                <div className="flex flex-col xl:flex-row gap-8 items-start relative">
                    {/* Main Content Area */}
                    <div className={`transition-all duration-300 ease-in-out ${selectedEntity ? 'xl:w-2/3 w-full' : 'w-full'}`}>
                        {activeTab === 'reports' && <ReportQueuePanel />}
                        {activeTab === 'entities' && <EntityListPanel onSelectEntity={handleSelectEntity} />}
                        {activeTab === 'syndicates' && <SyndicateListPanel onSelectEntity={handleSelectEntity} />}
                        {activeTab === 'connections' && <ConnectionsPanel />}
                        {activeTab === 'dossiers' && <DossierListPanel onSelectEntity={handleSelectEntity} />}
                    </div>

                    {/* Context Panel Sidebar */}
                    {selectedEntity && (
                        <div className="w-full xl:w-1/3 sticky top-24 shrink-0">
                            <EntityContextPanel 
                                entity={selectedEntity} 
                                mode={contextMode} 
                                onClose={handleContextClose}
                                onSaved={handleContextSaved}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}

export default function InvestigationHub() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>}>
            <InvestigationHubContent />
        </Suspense>
    );
}
