"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Users, Link as LinkIcon, FileText, Activity, Zap, ChevronRight, Settings, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { getAdminStats } from "./actions";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ dossiers: 0, syndicates: 0, entities: 0, health: "98%" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(data => {
        setCounts(data);
        setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Active Dossiers", value: counts.dossiers.toString(), icon: <FileText className="w-4 h-4" />, color: "blue" },
    { label: "Tracked Syndicates", value: counts.syndicates.toString(), icon: <ShieldAlert className="w-4 h-4" />, color: "crimson" },
    { label: "Verified Entities", value: counts.entities.toString(), icon: <Users className="w-4 h-4" />, color: "gold" },
    { label: "System Health", value: counts.health, icon: <Activity className="w-4 h-4" />, color: "emerald" },
  ];

  const tools = [
    { title: "Dossier Manager", desc: "Draft and publish deep intelligence reports.", href: "/admin/dossiers", icon: <FileText className="w-6 h-6" />, color: "blue" },
    { title: "Syndicate Registry", desc: "Manage organization nodes and hierarchies.", href: "/admin/syndicates", icon: <ShieldAlert className="w-6 h-6" />, color: "crimson" },
    { title: "Entity Controller", desc: "Modify PEP profiles and risk parameters.", href: "/admin/people", icon: <Users className="w-6 h-6" />, color: "gold" },
    { title: "Network Architect", desc: "Manually forge or sever network links.", href: "/admin/connections", icon: <LinkIcon className="w-6 h-6" />, color: "emerald" },
  ];

  return (
    <PageShell
      title="Admin Command Center"
      subtitle="Operational oversight and intelligence lifecycle management."
      badge="Watchdog Terminal"
      badgeColor="blue"
      icon={<Settings className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }]}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{stat.label}</span>
                        <span className="text-2xl font-black">{stat.value}</span>
                    </div>
                    <div className={`p-3 rounded-2xl bg-accent-${stat.color}/10 border border-accent-${stat.color}/20 text-accent-${stat.color}`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        {/* Operational Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, i) => (
                <Link 
                    key={i} 
                    href={tool.href}
                    className="group glass-card p-8 border-border-glass bg-bg-glass-heavy hover:border-accent-blue/30 transition-all flex flex-col justify-between min-h-[220px]"
                >
                    <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl bg-accent-${tool.color}/10 border border-accent-${tool.color}/20 flex items-center justify-center text-accent-${tool.color}`}>
                            {tool.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-accent-blue transition-colors">{tool.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-tighter font-medium">{tool.desc}</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-blue">Initialize Terminal</span>
                        <ChevronRight className="w-4 h-4 text-accent-blue group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            ))}
        </div>

        {/* Live System Logs (Placeholder) */}
        <div className="glass-card border-border-glass bg-bg-glass overflow-hidden">
            <div className="p-4 border-b border-border-glass bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Operational Audit Log</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Live Telemetry</span>
                </div>
            </div>
            <div className="p-6 font-mono text-[10px] space-y-2 text-muted-foreground h-64 overflow-y-auto">
                <p><span className="text-accent-blue">[06:42:11]</span> System initialized. All forensic nodes loaded.</p>
                <p><span className="text-accent-blue">[06:45:32]</span> Synchronizing with Sabinet High Court stream...</p>
                <p><span className="text-accent-blue">[06:50:04]</span> AI Deduction Engine identified 27 transitive alliances.</p>
                <p><span className="text-accent-crimson">[06:55:12]</span> Alert: High-risk PEP profile update detected (Katiso Molefe).</p>
                <p><span className="text-accent-blue">[07:01:45]</span> Automatic backup completed to Supabase cold-storage.</p>
                <p><span className="animate-pulse">_</span></p>
            </div>
        </div>
      </div>
    </PageShell>
  );
}
