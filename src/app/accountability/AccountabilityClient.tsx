"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  UserX, 
  ShieldAlert, 
  History, 
  Search, 
  Activity, 
  ChevronRight, 
  Skull, 
  Scale, 
  RefreshCw,
  Info,
  Fingerprint,
  Network,
  Heart,
  Megaphone,
  MapPinned
} from "lucide-react";
import WhatNext from "@/components/layout/WhatNext";
import { getTrcVolumes, triggerVolumeBackfill } from "./actions";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton, VolumeSkeleton } from "@/components/ui/Skeleton";
import { IntelligenceNull } from "@/components/ui/StatusStates";
import DataTabs from "@/components/ui/DataTabs";
import ForensicInfo from "@/components/ui/ForensicInfo";
import Link from "next/link";
import { ResponsiveDataGrid } from "@/components/ui/ResponsiveDataGrid";
import { FullScreenDataModal } from "@/components/ui/FullScreenDataModal";

export default function AccountabilityClient({ 
  initialVolumes, 
  initialPerpetrators 
}: { 
  initialVolumes: any[], 
  initialPerpetrators: any[] 
}) {
  const [selectedPerp, setSelectedPerp] = useState<any>(null);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [volumes, setVolumes] = useState<any[]>(initialVolumes);
  const [perpetrators, setPerpetrators] = useState<any[]>(initialPerpetrators);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dossiers");

  const supabase = createClient();

  useEffect(() => {
    if (supabase) {
      const channel = supabase
        .channel('trc_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trc_volumes' }, () => {
          fetchVolumes();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase]);

  const fetchVolumes = async () => {
    try {
      const data = await getTrcVolumes();
      setVolumes(data);
    } catch (err) {
      console.error("Error fetching volumes:", err);
    }
  };

  const handleTriggerBackfill = async () => {
    setIsBackfilling(true);
    try {
      const nextVolume = volumes.find(v => v.status === 'QUEUED');
      if (nextVolume) {
        await triggerVolumeBackfill(nextVolume.volume_number);
      }
    } catch (error: any) {
      console.error("Backfill trigger failed:", error);
    } finally {
      setIsBackfilling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INDEXED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'INDEXING': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'alive_unpunished': return 'text-accent-crimson border-accent-crimson/20 bg-accent-crimson/5';
      default: return 'text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => status.replace('_', ' ').toUpperCase();

  const TABS = [
    { id: "dossiers", label: "Perpetrators", count: perpetrators.length },
    { id: "vault", label: "TRC Vault", count: volumes.length },
    { id: "audit", label: "Oversight Audit" }
  ];

  return (
    <PageShell
      title="Accountability Board"
      subtitle="Tracking individuals who committed crimes but have never been prosecuted or held accountable."
      badge="Accountability"
      badgeColor="crimson"
      icon={<UserX className="w-6 h-6 text-accent-crimson" />}
      guidance="This page tracks officials and individuals who committed crimes — including corruption, state capture, and political violence — but have never been prosecuted or held accountable."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore", href: "/accountability" }, { label: "Accountability", href: "/accountability" }]}
      actions={
        <div className="flex gap-4">
          <Link href="/accountability/leadership" className="px-6 py-2.5 bg-bg-glass border border-border-glass text-foreground rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-bg-glass-heavy transition-all flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-accent-blue" /> Leadership Map
          </Link>
          <Link href="/accountability/assassinations" className="px-6 py-2.5 bg-accent-crimson/10 border border-accent-crimson/20 text-accent-crimson rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-accent-crimson/20 transition-all flex items-center gap-2">
            <Skull className="w-3.5 h-3.5" /> Tracker
          </Link>
          <button onClick={handleTriggerBackfill} disabled={isBackfilling} className="px-6 py-2.5 bg-charcoal text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-3 shadow-button-inset disabled:opacity-50 hidden md:flex">
            <RefreshCw className={`w-3.5 h-3.5 ${isBackfilling ? 'animate-spin' : ''}`} /> Excavate
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: "Unpunished Assets", value: "242", icon: <ShieldAlert className="w-5 h-5 text-accent-crimson" /> },
          { label: "Justice Index", value: "12.8%", icon: <Scale className="w-5 h-5 text-accent-blue" /> },
          { label: "Assassination Hits", value: "47", icon: <Skull className="w-5 h-5 text-accent-crimson" />, href: "/accountability/assassinations" },
          { label: "Leadership Audit", value: "68%", icon: <Network className="w-5 h-5 text-accent-gold" />, href: "/accountability/leadership" }
        ].map((item, i) => {
          const CardContent = (
            <div className={`glass-card p-8 bg-background border-border ${item.href ? 'hover:border-accent-crimson cursor-pointer transition-colors group' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${item.href ? 'text-accent-crimson' : 'text-charcoal-40'}`}>{item.label}</span>
                <div className={item.href ? 'group-hover:scale-110 transition-transform' : ''}>
                  {item.icon}
                </div>
              </div>
              <p className="text-3xl font-black tracking-tight text-charcoal font-mono uppercase">{item.value}</p>
            </div>
          );

          if (item.href) {
            return <Link key={i} href={item.href}>{CardContent}</Link>;
          }
          return <div key={i}>{CardContent}</div>;
        })}
      </div>

      <DataTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="min-h-[400px]"
        >
          {activeTab === "dossiers" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-charcoal-40 mb-8 flex items-center gap-3">
                  <History className="w-4 h-4 text-accent-crimson" /> 
                  Historical Injustice Records
                  <ForensicInfo title="Tracking" content="Documented perpetrators of crimes against humanity." source="TRC v7" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? <DossierSkeleton /> : perpetrators.map((perp, i) => (
                    <FullScreenDataModal
                      key={perp.id}
                      title={perp.full_name}
                      description={`Historical Injustice Record - ${perp.role_in_regime}`}
                      trigger={
                        <div className="glass-card p-6 sm:p-8 bg-background border-border hover:border-charcoal-40 cursor-pointer transition-all group touch-manipulation">
                          <h4 className="text-xl sm:text-2xl font-black text-charcoal mb-2 uppercase tracking-tight group-hover:text-accent-blue transition-colors">{perp.full_name}</h4>
                          <p className="text-[11px] font-black text-charcoal-40 uppercase tracking-widest">{perp.role_in_regime}</p>
                        </div>
                      }
                    >
                      <div className="space-y-6">
                        <div className="p-6 bg-accent-crimson/5 border border-accent-crimson/20 rounded-xl">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-accent-crimson mb-2">Primary Offense Node</h5>
                          <p className="text-foreground text-[14px] leading-relaxed font-medium">
                            {perp.details || "No expanded narrative found. Awaiting forensic distillation from TRC archives."}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-bg-glass border border-border-glass rounded-xl">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Status</span>
                            <span className="text-[13px] font-black uppercase text-accent-crimson">Unpunished</span>
                          </div>
                          <div className="p-5 bg-bg-glass border border-border-glass rounded-xl">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">TRC Index</span>
                            <span className="text-[13px] font-black uppercase text-foreground">Vol 7 Ref</span>
                          </div>
                        </div>
                      </div>
                    </FullScreenDataModal>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "vault" && (
            <div className="glass-card p-5 sm:p-10 bg-background border-border w-full">
              <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-charcoal-40 mb-8 sm:mb-10 px-2 sm:px-0">TRC_REPORT_VAULT</h3>
              <ResponsiveDataGrid 
                data={volumes}
                keyExtractor={(v) => String(v.id)}
                columns={[
                  {
                    header: "Volume",
                    accessorKey: "title",
                    mobilePriority: "primary",
                    cell: (v: any) => (
                      <span className="text-foreground font-bold text-[14px]">Vol {v.volume_number}: {v.title}</span>
                    )
                  },
                  {
                    header: "Status",
                    accessorKey: "status",
                    mobilePriority: "secondary",
                    cell: (v: any) => (
                      <span className={`text-[11px] font-black tracking-widest uppercase ${v.status === 'INDEXED' ? 'text-emerald-500' : 'text-accent-blue'}`}>
                        {v.status}
                      </span>
                    )
                  },
                  {
                    header: "Progress",
                    accessorKey: "progress",
                    mobilePriority: "secondary",
                    className: "w-[200px]",
                    cell: (v: any) => (
                      <div className="h-2.5 w-full min-w-[100px] bg-charcoal-3 rounded-full overflow-hidden mt-1 sm:mt-0">
                        <div className={`h-full ${v.status === 'INDEXED' ? 'bg-emerald-500' : 'bg-accent-blue'}`} style={{ width: `${v.progress}%` }} />
                      </div>
                    )
                  }
                ]}
              />
            </div>
          )}

          {activeTab === "audit" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-10 bg-background border-border">
                <h4 className="text-xl font-black text-charcoal uppercase mb-4 tracking-tight">Home Robbery Erasure</h4>
                <div className="pt-6 border-t border-border">
                  <span className="text-[11px] font-black text-accent-crimson uppercase tracking-widest">60% Reporting Collapse</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <WhatNext suggestions={[
        { title: "Court Rulings", description: "Browse real criminal court judgments.", href: "/justice/judgments", icon: Scale },
        { title: "Honouring Victims", description: "Read the stories of victims of political violence.", href: "/victims", icon: Heart },
        { title: "Report Corruption", description: "Report crimes you have witnessed anonymously.", href: "/report", icon: Megaphone },
      ]} />
    </PageShell>
  );
}
