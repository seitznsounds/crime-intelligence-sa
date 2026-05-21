import { createServerClient } from "@/lib/supabase-server";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";
import { Search, Network, Users, Megaphone } from "lucide-react";
import ExposeClient from "./ExposeClient";
import { getExposeData, getUniqueStatuses, getSyndicates } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExposePage() {
  const [initialData, uniqueStatuses, syndicates] = await Promise.all([
    getExposeData({ page: 1, pageSize: 12 }),
    getUniqueStatuses(),
    getSyndicates()
  ]);

  return (
    <PageShell
      title="People of Interest"
      subtitle="Real-time tracking of high-risk government officials, politicians, and verified crime syndicate facilitators."
      badge="Investigation"
      badgeColor="crimson"
      icon={<Search className="w-6 h-6 text-accent-crimson" />}
      guidance="This page lists politicians, government officials, and suspected crime syndicate members who have been linked to corruption or organised crime. You can filter and search to find specific people."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Explore", href: "/expose" },
      ]}
    >
      <ExposeClient 
        initialPeople={initialData.people} 
        initialTotalCount={initialData.totalCount}
        uniqueStatuses={uniqueStatuses}
        syndicates={syndicates}
      />
      <WhatNext suggestions={[
        { title: "Corruption Connections", description: "See how these people are connected to each other and to crime networks.", href: "/network", icon: "Network" },
        { title: "Crime Syndicates", description: "Explore the structure of organised crime groups in South Africa.", href: "/syndicates", icon: "Users" },
        { title: "Report What You Know", description: "Have information about someone on this list? Report it anonymously.", href: "/report", icon: "Megaphone" },
      ]} />
    </PageShell>
  );
}
