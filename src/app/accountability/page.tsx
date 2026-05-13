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
  Fingerprint
} from "lucide-react";
import { getTrcVolumes, triggerVolumeBackfill } from "./actions";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton, VolumeSkeleton } from "@/components/ui/Skeleton";
import { IntelligenceNull } from "@/components/ui/StatusStates";
import DataTabs from "@/components/ui/DataTabs";
import ForensicInfo from "@/components/ui/ForensicInfo";

export default function AccountabilityPage() {
  const [selectedPerp, setSelectedPerp] = useState<any>(null);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [perpetrators, setPerpetrators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dossiers");

  const supabase = createClient();

  useEffect(() => {
    fetchData();

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

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchVolumes(), fetchPerpetrators()]);
    setLoading(false);
  };

  const fetchVolumes = async () => {
    try {
      const data = await getTrcVolumes();
      setVolumes(data);
    } catch (err) {
      console.error("Error fetching volumes:", err);
    }
  };

  const fetchPerpetrators = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("humanity_crimes_perpetrators")
      .select("*")
      .order("risk_rank", { ascending: false });
    if (data) setPerpetrators(data);
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
      subtitle="Tracking unpunished perpetrators cross-referenced with TRC narratives."
      badge="Justice Monitoring"
      badgeColor="crimson"
      icon={<UserX className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Accountability", href: "/accountability" }]}
      actions={
        <button onClick={handleTriggerBackfill} disabled={isBackfilling} className="px-6 py-2.5 bg-charcoal text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-3 shadow-button-inset disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${isBackfilling ? 'animate-spin' : ''}`} /> Trigger Excavation
        </button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: "Unpunished Assets", value: "242", icon: <ShieldAlert className="w-5 h-5 text-accent-crimson" /> },
          { label: "Justice Index", value: "12.8%", icon: <Scale className="w-5 h-5 text-accent-blue" /> }
        ].map((item, i) => (
          <div key={i} className="glass-card p-8 bg-background border-border">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal-40">{item.label}</span>
              {item.icon}
            </div>
            <p className="text-3xl font-black tracking-tight text-charcoal font-mono uppercase">{item.value}</p>
          </div>
        ))}
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
                    <div key={perp.id} onClick={() => setSelectedPerp(perp)} className="glass-card p-8 bg-background border-border hover:border-charcoal-40 cursor-pointer transition-all group">
                      <h4 className="text-2xl font-black text-charcoal mb-2 uppercase tracking-tight group-hover:text-accent-blue transition-colors">{perp.full_name}</h4>
                      <p className="text-[11px] font-black text-charcoal-40 uppercase tracking-widest">{perp.role_in_regime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "vault" && (
            <div className="glass-card p-10 bg-background border-border max-w-4xl">
              <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-charcoal-40 mb-10">TRC_REPORT_VAULT</h3>
              <div className="space-y-8">
                {volumes.map((item) => (
                  <div key={item.id} className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="text-charcoal-83">Vol {item.volume_number}: {item.title}</span>
                      <span className="text-accent-blue">{item.status}</span>
                    </div>
                    <div className="h-2 bg-charcoal-3 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-blue" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
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
    </PageShell>
  );
}
