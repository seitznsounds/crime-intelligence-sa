"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Scale, FileText, ChevronRight, History, Activity, AlertTriangle, Globe } from "lucide-react";
import { fetchRecentIntelligence } from "@/lib/intelligence-actions";
import Link from "next/link";

export default function IntelligenceDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{ judgments: any[], news: any[] }>({ judgments: [], news: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchRecentIntelligence().then(res => {
        setData(res);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button - Floating or fixed */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-accent-blue text-white rounded-2xl shadow-glow-blue hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">Latest Updates</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border-glass z-[101] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-glass flex items-center justify-between bg-bg-glass-heavy">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-blue/10 rounded-lg">
                    <Activity className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-tight">Latest Updates</h2>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Live feed</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* Recent Judgments */}
                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-blue flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5" /> Recent Court Rulings
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.judgments.map((j) => (
                        <div key={j.id} className="p-4 bg-bg-glass border border-border-glass rounded-xl hover:border-accent-blue/30 transition-all group">
                          <span className="text-[9px] font-mono text-accent-blue uppercase mb-1 block">
                            {j.metadata?.['Case Number'] || 'Court Ruling'}
                          </span>
                          <h4 className="text-[13px] font-bold leading-snug mb-2 line-clamp-2">{j.title}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(j.event_date).toLocaleDateString()}</span>
                            <Link href={`/justice/judgments/${j.id}`} className="text-[10px] font-black text-accent-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recent News */}
                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-crimson flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Latest News
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.news.map((n) => (
                        <div key={n.id} className="p-4 bg-bg-glass border border-border-glass rounded-xl hover:border-accent-crimson/30 transition-all group">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="px-1.5 py-0.5 rounded bg-accent-crimson/10 border border-accent-crimson/20 text-[8px] font-black text-accent-crimson uppercase">{n.type}</span>
                          </div>
                          <h4 className="text-[13px] font-bold leading-snug mb-2 line-clamp-2">{n.title}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(n.occurred_at).toLocaleDateString()}</span>
                            <a href={n.source_url} target="_blank" className="text-[10px] font-black text-accent-crimson flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read Article <ChevronRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-glass bg-bg-glass-heavy space-y-3">
                <Link 
                  href="/justice/heatmap" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-accent-gold/20 border border-accent-gold/30 text-accent-gold text-[11px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-accent-gold hover:text-black transition-all"
                >
                  View Court Case Map <Globe className="w-4 h-4" />
                </Link>
                <Link 
                  href="/justice" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-accent-blue text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-glow-blue"
                >
                  Browse All Court Rulings <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
