import { createServerClient } from "@/lib/supabase-server";
import { 
  ArrowLeft, 
  Activity, 
  MapPin, 
  Database
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StationAuditView } from "@/components/StationAuditView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StationAuditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  // Fetch station details
  const { data: station, error } = await supabase
    .from("station_statistics")
    .select("*")
    .eq("id", id)
    .single();

  if (!station || error) return notFound();

  // Fetch related categories for this station to build a breakdown
  const { data: otherStats } = await supabase
    .from("station_statistics")
    .select("category, incident_count")
    .eq("station_id", station.station_id)
    .limit(10);

  return (
    <div className="relative min-h-screen bg-background py-16">
      {/* Cinematic Backdrop */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,#ff3b3003,transparent_50%)]" />
      
      <div className="container max-w-5xl relative z-10">
        <Link 
          href="/stats" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Leaderboard
        </Link>

        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-accent-blue/5 border border-accent-blue/10 mb-6">
                <MapPin className="w-3.5 h-3.5 text-accent-blue" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent-blue">Localized Audit Protocol</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase mb-4 leading-none break-words">
                {station.station_name || "STATION_UNNAMED"}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/20">
                  <Database className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">ID: {station.station_id}</span>
                </div>
                <div className="flex items-center gap-2 text-white/20">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">Period: {station.period}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.02] text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-crimson mb-4">Risk Probability</p>
              <div className="text-5xl font-bold tracking-tighter mb-2">91.4<span className="text-lg">%</span></div>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Critical Level Identified</p>
            </div>
          </div>
        </header>

        {/* Client View Components (Animations & Interactive state) */}
        <StationAuditView station={station} otherStats={otherStats} />

        <footer className="mt-24 pt-12 border-t border-white/[0.03] flex justify-between items-center">
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
            SYSTEM_AUDIT_VERIFIED // SAPS_NODE_{station.station_id?.split('-')[0]}
          </div>
          <p className="text-[10px] text-white/10 italic">
            "Transparency is the only deterrent against institutional decay."
          </p>
        </footer>
      </div>
    </div>
  );
}
