import { createServerClient } from "@/lib/supabase-server";
import PageShell from "@/components/layout/PageShell";
import { Search } from "lucide-react";
import ExposeClient from "./ExposeClient";

export const dynamic = "force-dynamic";

export default async function ExposePage() {
  const supabase = await createServerClient();

  // Fetch top 12 people by risk score
  const { data: people } = await supabase
    .from("people")
    .select("id, full_name, pep_tier, risk_score, status, role, profile_image_url, metadata")
    .order("risk_score", { ascending: false })
    .limit(12);

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
      <ExposeClient initialPeople={people || []} />
    </PageShell>
  );
}
