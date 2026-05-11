import { createServerClient } from "@/lib/supabase-server";
import { ExposureCard } from "@/components/ExposureCard";

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
    <div className="container py-12 animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Expose Board</h1>
        <p className="text-white/40 max-w-2xl font-light">
          Real-time tracking of high-risk government officials, politicians, and verified crime syndicate facilitators.
        </p>
      </header>

      {error ? (
        <div className="p-8 glass-card text-accent-crimson font-mono text-xs">
          ERROR_ACCESSING_DATABASE: {error.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {people?.map((person) => (
            <ExposureCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
