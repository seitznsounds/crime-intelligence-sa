import { createServerClient } from "@/lib/supabase-server";
import { ExposureCard } from "@/components/ExposureCard";
import PageShell from "@/components/layout/PageShell";
import { Search } from "lucide-react";
import { ErrorState } from "@/components/ui/StatusStates";

export const dynamic = "force-dynamic";

export default async function ExposePage() {
  const supabase = await createServerClient();

  // Fetch top 12 people by risk score or PEP tier
  const { data: people, error } = await supabase
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
        { label: "Expose Board", href: "/expose" },
      ]}
    >
      {error ? (
        <ErrorState 
          title="Intelligence Database Link Severed"
          description={`Error Code: ${error.code} | Message: ${error.message}`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {people?.map((person) => (
            <ExposureCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
