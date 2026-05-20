"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  MapPin, 
  ShieldAlert, 
  ChevronRight,
  RefreshCw,
  Target,
  User
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
  severity_level: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  occurred_at?: string;
  incident_date?: string;
  title: string;
}

export default function LiveTicker() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLive, setIsLive] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;

    // Initial fetch of recent incidents from our crime database
    const fetchRecent = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (data) {
        setIncidents(data);
        setIsLive(true);
      }
      if (error) console.error("Ticker fetch error:", error);
    };

    fetchRecent();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('live-incidents')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incidents' },
        (payload: { new: Record<string, unknown> }) => {
          setIncidents((current) => [payload.new as unknown as Incident, ...current.slice(0, 14)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-3xl border-t border-border-glass h-14 flex items-center overflow-hidden shadow-2xl">
      {/* Live Status Indicator */}
      <div className="flex items-center gap-3 px-6 border-r border-border-glass h-full bg-accent-crimson/5">
        <div className="relative">
          <div className="w-1.5 h-1.5 bg-accent-crimson rounded-full animate-ping" />
          <div className="absolute inset-0 w-1.5 h-1.5 bg-accent-crimson rounded-full shadow-glow-crimson" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-accent-crimson leading-none">Live Feed</span>
          <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Status: LIVE</span>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        <div className="flex items-center gap-10 px-8 whitespace-nowrap animate-marquee">
          {incidents.length > 0 ? (
            incidents.map((incident, i) => (
              <motion.div 
                key={incident.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-6 group cursor-pointer hover:bg-white/[0.02] px-4 py-2 rounded-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
                    [{new Date(incident.occurred_at || incident.incident_date || incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                  </span>
                  <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                    incident.severity_level >= 3 
                      ? 'bg-accent-crimson/10 border-accent-crimson/30 text-accent-crimson shadow-glow-crimson/20' 
                      : 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'
                  }`}>
                    {incident.type}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <Target className="w-2.5 h-2.5 text-muted-foreground/40" />
                      <span className="text-[10px] font-bold tracking-tight text-foreground/90 group-hover:text-accent-blue transition-colors">
                        {incident.title?.length > 45 ? `${incident.title.substring(0, 45)}...` : incident.title}
                      </span>
                   </div>
                   
                   <div className="flex items-center gap-1.5">
                      <MapPin className="w-2.5 h-2.5 text-muted-foreground/40" />
                      <span className="text-[9px] font-mono font-medium text-muted-foreground uppercase">
                        {incident.location || 'Unknown location'}
                      </span>
                   </div>

                   {incident.latitude && (
                     <span className="text-[8px] font-mono text-accent-blue/40 hidden xl:inline">
                       GPS: {incident.latitude.toFixed(4)}, {incident.longitude?.toFixed(4)}
                     </span>
                   )}
                </div>
                <div className="w-px h-3 bg-border-glass/50" />
              </motion.div>
            ))
          ) : (
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-8">
              Loading latest incidents...
            </div>
          )}

          {/* Repeat for seamless loop */}
          {incidents.slice(0, 5).map((incident, i) => (
              <div key={`${incident.id}-loop`} className="flex items-center gap-6 opacity-30">
                <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">[{new Date(incident.occurred_at || incident.incident_date || incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{incident.type}</span>
                <span className="text-[10px] font-bold tracking-tight text-muted-foreground">{incident.title}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Control Module */}
      <div className="hidden md:flex items-center gap-4 px-6 border-l border-border-glass h-full bg-bg-glass-heavy">
         <div className="flex items-center gap-2.5">
            <RefreshCw className={`w-3 h-3 text-accent-blue ${isLive ? 'animate-spin-slow' : ''}`} />
            <div className="text-right flex flex-col justify-center">
               <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest leading-none">Status</p>
               <p className="text-[9px] font-mono font-bold text-foreground leading-none mt-0.5">LIVE</p>
            </div>
         </div>
         <button className="p-1.5 bg-background border border-border-glass rounded-lg hover:border-accent-crimson transition-all group">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent-crimson" />
         </button>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
