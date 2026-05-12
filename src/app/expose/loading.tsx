import PageShell from "@/components/layout/PageShell";
import { DossierSkeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";

export default function ExposeLoading() {
  return (
    <PageShell
      title="Expose Board"
      subtitle="Real-time tracking of high-risk government officials, politicians, and verified crime syndicate facilitators."
      badge="Intelligence Sector"
      badgeColor="crimson"
      icon={<Search className="w-6 h-6 text-accent-crimson" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <DossierSkeleton key={i} />
        ))}
      </div>
    </PageShell>
  );
}
