import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton } from "@/components/ui/Skeleton";
import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <PageShell
      title="Victim Tributes"
      subtitle="Loading living monuments and sacrificial narratives..."
      badge="TRC Phase 7: Narrative Sector"
      badgeColor="crimson"
      icon={<Heart className="w-6 h-6 text-accent-crimson" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <DossierSkeleton key={i} />
        ))}
      </div>
    </PageShell>
  );
}
