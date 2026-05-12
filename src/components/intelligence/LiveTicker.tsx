"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Incident {
  id: string;
  category: string;
  location: string;
  risk_level: number;
  created_at: string;
}

export default function LiveTicker() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLive, setIsLive] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of recent incidents
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) setIncidents(data);
      setIsLive(true);
    };

    fetchRecent();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('live-incidents')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incidents' },
        (payload) => {
          setIncidents((current) => [payload.new as Incident, ...current.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border-glass h-16 flex items-center overflow-hidden">
      {/* Live Status Indicator */}
      <div className="flex items-center gap-4 px-8 border-r border-border-glass h-full bg-accent-crimson/5">
        <div className="relative">
          <div className="w-2 h-2 bg-accent-crimson rounded-full animate-ping" />
          <div className="absolute inset-0 w-2 h-2 bg-accent-crimson rounded-full shadow-glow-crimson" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-crimson">Live Feed</span>
          <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Latency: 42ms</span>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        <div className="flex items-center gap-12 px-12 whitespace-nowrap animate-marquee">
          <AnimatePresence mode="popLayout">
            {incidents.map((incident, i) => (
              <motion.div 
                key={incident.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">[{new Date(incident.created_at).toLocaleTimeString()}]</span>
                  <div className={`px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest ${incident.risk_level > 7 ? 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'}`}>
                    {incident.category}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <MapPin className="w-3 h-3 text-muted-foreground" />
                   <span className="text-[10px] font-bold uppercase tracking-tighter text-foreground/80 group-hover:text-foreground transition-colors">{incident.location}</span>
                </div>
                <div className="w-px h-4 bg-border-glass" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Repeat for continuous scroll if needed */}
          {incidents.length > 0 && incidents.map((incident, i) => (
              <div key={`${incident.id}-repeat`} className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                   <span className="text-[9px] font-mono uppercase tracking-widest">[{new Date(incident.created_at).toLocaleTimeString()}]</span>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{incident.category}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{incident.location}</span>
                <div className="w-px h-4 bg-border-glass" />
              </div>
            ))}
        </div>
      </div>

      {/* Tactical HUD Controls */}
      <div className="hidden lg:flex items-center gap-6 px-8 border-l border-border-glass h-full bg-bg-glass">
         <div className="flex items-center gap-3">
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${isLive ? 'animate-spin-slow' : ''}`} />
            <div className="text-right">
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active_Sessions</p>
               <p className="text-[10px] font-mono font-bold text-accent-blue">1,204_USERS</p>
            </div>
         </div>
         <button className="p-2 bg-bg-glass border border-border-glass rounded-lg hover:bg-bg-glass-heavy transition-all group">
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
         </button>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
