"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShieldAlert, 
  Map as MapIcon, 
  Network, 
  FileText, 
  ShieldCheck, 
  Fingerprint, 
  Zap,
  Activity,
  ChevronRight,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { searchIntelligence } from "@/lib/search-actions";

const ACTIONS = [
  { id: "expose", label: "Enter Exposure Board", href: "/expose", icon: <ShieldAlert className="w-4 h-4" />, category: "Intelligence" },
  { id: "map", label: "Open Crime Heatmap", href: "/map", icon: <MapIcon className="w-4 h-4" />, category: "Geospatial" },
  { id: "network", label: "Analyze Corruption Links", href: "/network", icon: <Network className="w-4 h-4" />, category: "Intelligence" },
  { id: "report", label: "Initiate Secure Uplink", href: "/report", icon: <ShieldCheck className="w-4 h-4" />, category: "Actions" },
  { id: "vault", label: "Access Evidence Vault", href: "/vault", icon: <Zap className="w-4 h-4" />, category: "History" },
  { id: "stations", label: "Audit SAPS Stations", href: "/stats", icon: <Target className="w-4 h-4" />, category: "Audits" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const search = async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        const data = await searchIntelligence(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl overflow-hidden glass-card border-border-glass bg-background/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,59,48,0.1)] rounded-3xl"
          >
            <Command className="flex flex-col h-full">
              <div className="flex items-center px-6 py-5 border-b border-border-glass gap-4">
                <Search className="w-5 h-5 text-accent-crimson" />
                <Command.Input 
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Initiate global intelligence query... (e.g. 'Audit SAPS')" 
                  className="flex-1 bg-transparent border-none text-[13px] text-foreground focus:outline-none placeholder:text-muted-foreground/30 font-light tracking-wide"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-bg-glass border border-border-glass rounded-lg text-[10px] font-mono text-muted-foreground">
                  <span className="text-[11px]">ESC</span>
                </div>
              </div>

              <Command.List className="max-h-[450px] overflow-y-auto p-4 scrollbar-hide">
                {isSearching && (
                  <div className="py-12 text-center">
                    <Activity className="w-8 h-8 text-accent-crimson animate-spin mx-auto mb-4 opacity-40" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanning database nodes...</p>
                  </div>
                )}

                {!isSearching && results.length > 0 && (
                  <Command.Group heading={<span className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-crimson block mb-3 mt-4">Intelligence Matches</span>}>
                    {results.map((result) => (
                      <Command.Item
                        key={result.id}
                        onSelect={() => runCommand(() => router.push(result.href))}
                        className="group flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer hover:bg-bg-glass border border-transparent hover:border-border-glass transition-all mb-1"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-accent-crimson/5 border border-accent-crimson/10 flex items-center justify-center text-accent-crimson">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-foreground group-aria-selected:text-accent-crimson transition-colors">{result.label}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{result.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-aria-selected:text-accent-crimson transition-colors" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Empty className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="w-8 h-8 text-muted-foreground/20 animate-pulse" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">No intelligence matching query found.</p>
                  </div>
                </Command.Empty>

                <Command.Group heading={<span className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 block mb-3 mt-4">Operational Commands</span>}>
                  {ACTIONS.map((action) => (
                    <Command.Item
                      key={action.id}
                      onSelect={() => runCommand(() => router.push(action.href))}
                      className="group flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer hover:bg-bg-glass border border-transparent hover:border-border-glass transition-all mb-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-bg-glass-heavy border border-border-glass flex items-center justify-center text-muted-foreground group-aria-selected:text-accent-crimson group-aria-selected:border-accent-crimson/30 transition-colors">
                          {action.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-foreground group-aria-selected:text-accent-crimson transition-colors">{action.label}</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{action.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-aria-selected:text-accent-crimson transition-colors" />
                    </Command.Item>
                  ))}
                </Command.Group>
                
                <div className="mt-8 mb-4 border-t border-border-glass pt-6 px-3">
                   <div className="flex items-center gap-2 mb-4">
                      <Fingerprint className="w-3 h-3 text-muted-foreground/40" />
                      <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40">Encryption Layer ACTIVE</span>
                   </div>
                </div>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
