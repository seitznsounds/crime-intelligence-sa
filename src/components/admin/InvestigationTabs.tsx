"use client";

import { FileText, Link as LinkIcon, ShieldAlert, Users, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface InvestigationTabsProps {
    pendingCount: number;
}

export const TABS = [
    { id: "reports", label: "Reports", icon: AlertCircle, color: "crimson" },
    { id: "entities", label: "Entities", icon: Users, color: "gold" },
    { id: "syndicates", label: "Syndicates", icon: ShieldAlert, color: "crimson" },
    { id: "connections", label: "Connections", icon: LinkIcon, color: "emerald" },
    { id: "dossiers", label: "Dossiers", icon: FileText, color: "blue" }
];

export default function InvestigationTabs({ pendingCount }: InvestigationTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") || "reports";

    const setTab = (tabId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tabId);
        // Clear selected entity on tab switch, or maybe not. But usually good.
        params.delete("id");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex gap-2 border-b border-border-glass pb-4 mb-6 overflow-x-auto custom-scrollbar">
            {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                            ${isActive 
                                ? `bg-accent-${tab.color}/10 text-accent-${tab.color} border border-accent-${tab.color}/20` 
                                : `text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent`
                            }
                        `}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                        {tab.id === "reports" && pendingCount > 0 && (
                            <span className="ml-1.5 bg-accent-crimson text-white px-1.5 py-0.5 rounded-full text-[9px] shadow-glow-crimson">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
