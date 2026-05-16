import { createServerClient } from "@/lib/supabase-server";
import PageShell from "@/components/layout/PageShell";
import { Search } from "lucide-react";
import ExposeClient from "./ExposeClient";
import { getExposeData, getUniqueStatuses } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExposePage() {
  const [initialData, uniqueStatuses] = await Promise.all([
    getExposeData({ page: 1, pageSize: 12 }),
    getUniqueStatuses()
  ]);

  return (
    <PageShell
      title="Expose Board"
      subtitle="Real-time tracking of high-risk government officials, politicians, and verified crime syndicate facilitators."
      badge="Intelligence Sector"
      badgeColor="crimson"
      icon={<Search className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Investigate", href: "/expose" },
      ]}
    >
      <ExposeClient 
        initialPeople={initialData.people} 
        initialTotalCount={initialData.totalCount}
        uniqueStatuses={uniqueStatuses}
      />
    </PageShell>
  );
}
