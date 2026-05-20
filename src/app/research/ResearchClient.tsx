"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Loader2, CheckCircle2, AlertCircle, ChevronRight, FileText, Network, Zap, Globe, ShieldCheck, Scale } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";
import { startInvestigation, checkInvestigationStatus, fetchInvestigationResults } from "./actions";

export default function ResearchClient() {
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState(1);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Polling for status
  useEffect(() => {
    let interval: any;
    if (runId && (status === "RUNNING" || status === "READY" || status === "QUEUED")) {
      interval = setInterval(async () => {
        try {
          const { status: newStatus } = await checkInvestigationStatus(runId);
          setStatus(newStatus as string);
          
          if (newStatus === "SUCCEEDED") {
            const items = await fetchInvestigationResults(runId);
            setResults(items);
            setIsInvestigating(false);
            clearInterval(interval);
          } else if (newStatus === "FAILED" || newStatus === "ABORTED") {
            setError("Investigation failed or was aborted.");
            setIsInvestigating(false);
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Error checking status:", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [runId, status]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsInvestigating(true);
    setResults([]);
    setError(null);
    setStatus("QUEUED");

    const formData = new FormData();
    formData.append("query", query);
    formData.append("depth", depth.toString());

    try {
      const { runId: newRunId } = await startInvestigation(formData);
      setRunId(newRunId);
      setStatus("RUNNING");
    } catch (e: any) {
      setError(e.message || "Failed to start investigation.");
      setIsInvestigating(false);
    }
  };

  return (
    <PageShell
      title="AI Investigator"
      subtitle="Use our AI tool to search across thousands of documents, news articles, and public records to find connections and evidence."
      badge="Research Tool"
      badgeColor="blue"
      icon={<Brain className="w-6 h-6 text-accent-blue" />}
      guidance="Type in what you want to investigate, choose how deep you want the AI to search, and click start. The AI will scan the internet and our databases to find relevant information."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore", href: "/research" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Controls */}
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 border-border-glass bg-bg-glass">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
              <Search className="w-4 h-4" /> Investigation Parameters
            </h3>
            
            <form onSubmit={handleStart} className="space-y-6">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Research Query</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 'Phala Phala furniture procurement links'"
                  className="w-full bg-charcoal-3 border border-border-glass rounded-xl p-4 text-sm focus:outline-none focus:border-accent-blue transition-all"
                  disabled={isInvestigating}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Research Depth</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepth(d)}
                      className={`flex-1 p-3 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                        depth === d ? 'border-accent-blue bg-accent-blue/10 text-accent-blue' : 'border-border-glass text-muted-foreground hover:bg-bg-glass-heavy'
                      }`}
                      disabled={isInvestigating}
                    >
                      {d === 1 ? 'Surface' : d === 2 ? 'In-Depth' : 'Forensic'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isInvestigating || !query}
                className="w-full py-4 bg-accent-blue text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isInvestigating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Investigating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Execute Research Pass
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="glass-card p-6 border-accent-gold/20 bg-accent-gold/[0.02]">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent-gold mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Intelligence Source Notice
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Deep Research agents utilize recursive Google Search and Playwright scraping to map entities across global registries. All findings are timestamped and cryptographically indexed.
            </p>
          </div>
        </div>

        {/* Right Col: Progress & Results */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {isInvestigating || status ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-8 sm:p-10 border-border-glass bg-bg-glass-heavy text-center"
              >
                {status === "SUCCEEDED" ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                ) : error ? (
                  <AlertCircle className="w-12 h-12 text-accent-crimson mx-auto mb-4" />
                ) : (
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-accent-blue/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-accent-blue rounded-full border-t-transparent animate-spin" />
                    <Brain className="absolute inset-0 m-auto w-6 h-6 text-accent-blue animate-pulse" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold uppercase tracking-tight text-foreground mb-2">
                  {status === "SUCCEEDED" ? "Investigation Complete" : error ? "Operational Failure" : "Deep Analysis in Progress"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {runId ? `Run ID: ${runId}` : "Initializing secure intelligence link..."}
                </p>

                {!error && status !== "SUCCEEDED" && (
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="h-1.5 w-full bg-border-glass rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent-blue"
                        initial={{ width: "0%" }}
                        animate={{ width: status === "RUNNING" ? "65%" : "10%" }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Status: {status}</span>
                      <span>Pass: {depth} of {depth}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[300px] border-2 border-dashed border-border-glass rounded-2xl flex flex-col items-center justify-center text-muted-foreground"
              >
                <Network className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">Enter a query to begin deep forensic research.</p>
              </motion.div>
            )}

            {results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Intelligence Briefing</h3>
                  <span className="text-[11px] font-mono text-emerald-500">{results.length} NODES IDENTIFIED</span>
                </div>

                {results.map((item, i) => (
                  <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass hover:border-accent-blue/30 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-accent-blue" />
                        <h4 className="text-[14px] font-black uppercase tracking-tight text-foreground truncate max-w-[400px]">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/60">{item.source}</span>
                    </div>
                    
                    {item.content && (
                      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-light">
                        {item.content.replace(/[#*`]/g, '').slice(0, 300)}...
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-glass">
                      <div className="flex gap-2">
                        {item.rank > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-charcoal-3 border border-border-glass text-[9px] font-black tracking-widest text-muted-foreground uppercase">RANK {item.rank}</span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-accent-blue/5 border border-accent-blue/20 text-[9px] font-black tracking-widest text-accent-blue uppercase">VERIFIED</span>
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-widest text-accent-blue hover:underline flex items-center gap-1"
                      >
                        View Full Source <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <WhatNext suggestions={[
        { title: "Anti-Corruption Tracker", description: "Track progress on reforms.", href: "/anticorruption", icon: ShieldCheck },
        { title: "Court Rulings", description: "Read real court judgments.", href: "/justice/judgments", icon: Scale },
        { title: "People of Interest", description: "See individuals linked to corruption.", href: "/expose", icon: Search },
      ]} />
    </PageShell>
  );
}
