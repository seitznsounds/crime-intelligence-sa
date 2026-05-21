"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ExposureCard } from "@/components/ExposureCard";
import { offlineStorage } from "@/lib/offline-storage";
import { WifiOff, Search, Filter, ChevronLeft, ChevronRight, UserMinus, UserCheck, Skull, ShieldAlert, Star, Users, Info } from "lucide-react";
import { getExposeData } from "./actions";

export default function ExposeClient({ 
  initialPeople, 
  initialTotalCount,
  uniqueStatuses,
  syndicates
}: { 
  initialPeople: any[], 
  initialTotalCount: number,
  uniqueStatuses: string[],
  syndicates: {id: string, name: string}[]
}) {
  const [people, setPeople] = useState(initialPeople);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [riskLevelFilter, setRiskLevelFilter] = useState("ALL");
  const [syndicateFilter, setSyndicateFilter] = useState("ALL");
  const [vitalStatusFilter, setVitalStatusFilter] = useState("ALL"); // ALL, ALIVE, DECEASED
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Debounced Search
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const filters = {
      query: debouncedQuery,
      status: statusFilter,
      tier: tierFilter,
      riskLevel: riskLevelFilter,
      syndicateId: syndicateFilter,
      isDeceased: vitalStatusFilter === "DECEASED" ? true : vitalStatusFilter === "ALIVE" ? false : null,
      page,
      pageSize
    };

    const result = await getExposeData(filters);
    setPeople(result.people);
    setTotalCount(result.totalCount);
    setIsLoading(false);

    // Save to offline storage
    const storage = offlineStorage;
    if (result.people.length > 0 && storage) {
      result.people.forEach(p => storage.saveDossier(p));
    }
  }, [debouncedQuery, statusFilter, tierFilter, riskLevelFilter, syndicateFilter, vitalStatusFilter, page]);

  useEffect(() => {
    // Skip first load if we have initial data and it's page 1 with no filters
    if (page === 1 && debouncedQuery === "" && statusFilter === "ALL" && tierFilter === "ALL" && vitalStatusFilter === "ALL" && riskLevelFilter === "ALL" && syndicateFilter === "ALL") {
      return;
    }
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {isOfflineMode && (
        <div className="flex items-center gap-3 p-4 bg-accent-crimson/10 border border-accent-crimson/20 rounded-2xl animate-fade-in">
          <WifiOff className="w-5 h-5 text-accent-crimson" />
          <div>
            <p className="text-[12px] font-black uppercase tracking-widest text-accent-crimson">Offline Mode Active</p>
            <p className="text-[11px] text-accent-crimson/60 font-medium">Displaying locally cached intelligence from your last successful uplink.</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-card p-5 border-border-glass bg-bg-glass flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input 
              type="text" 
              placeholder="Search by name, role, or ID..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-background border border-border-glass rounded-lg py-2.5 pl-10 pr-4 text-[12px] text-foreground focus:outline-none focus:border-accent-blue/50 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[140px]"
              >
                <option value="ALL">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
            </div>

            {/* Vital Status Filter */}
            <div className="relative">
              <select 
                value={vitalStatusFilter}
                onChange={(e) => {
                  setVitalStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[140px]"
              >
                <option value="ALL">Vital Status</option>
                <option value="ALIVE">Alive</option>
                <option value="DECEASED">Deceased</option>
              </select>
              <Skull className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
            </div>

            {/* Syndicate Filter */}
            <div className="relative">
              <select 
                value={syndicateFilter}
                onChange={(e) => {
                  setSyndicateFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[160px]"
              >
                <option value="ALL">All Syndicates</option>
                {syndicates.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
            </div>

            {/* Tier Filter */}
            <div className="relative group z-30">
              <select 
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[140px]"
              >
                <option value="ALL">All Tiers</option>
                <option value="1">Tier 1 (National)</option>
                <option value="2">Tier 2 (Execs/Judges)</option>
                <option value="3">Tier 3 (Proxies)</option>
                <option value="PEP">Any PEP</option>
                <option value="NON-PEP">Non-PEP</option>
              </select>
              <Star className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
              <div className="absolute top-12 left-0 hidden group-hover:block w-72 p-4 bg-background border border-accent-blue/30 rounded-xl shadow-xl text-[11px] normal-case tracking-normal text-muted-foreground">
                <p className="font-black text-white mb-2 tracking-widest uppercase text-[10px] flex items-center gap-2"><Info className="w-3 h-3 text-accent-blue"/> PEP Tiers</p>
                <ul className="list-disc pl-4 space-y-1.5">
                   <li><strong className="text-white/90">Tier 1:</strong> Heads of state, cabinet ministers, national politicians.</li>
                   <li><strong className="text-white/90">Tier 2:</strong> Senior SOE executives, judges, high-ranking officials.</li>
                   <li><strong className="text-white/90">Tier 3:</strong> Suspects, intermediaries, and close proxies.</li>
                </ul>
              </div>
            </div>

            {/* Risk Filter */}
            <div className="relative group z-20">
              <select 
                value={riskLevelFilter}
                onChange={(e) => {
                  setRiskLevelFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[150px]"
              >
                <option value="ALL">All Risks</option>
                <option value="CRITICAL">Critical Risk (8-10)</option>
                <option value="ELEVATED">Elevated Risk (5-7)</option>
                <option value="LOW">Low Risk (&lt; 5)</option>
              </select>
              <ShieldAlert className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
              <div className="absolute top-12 right-0 hidden group-hover:block w-64 p-4 bg-background border border-accent-crimson/30 rounded-xl shadow-xl text-[11px] normal-case tracking-normal text-muted-foreground">
                <p className="font-black text-white mb-2 tracking-widest uppercase text-[10px] flex items-center gap-2"><Info className="w-3 h-3 text-accent-crimson"/> Risk Score Index</p>
                A quantitative metric (1.0 - 10.0) indicating an individual&apos;s threat level based on proven involvement in criminal incidents, proximity to syndicates, and positions of authority.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results HUD */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Showing {people.length} of {totalCount} Entities
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1 hover:bg-white/5 rounded-full transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-muted-foreground">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="p-1 hover:bg-white/5 rounded-full transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 glass-card bg-bg-glass/50 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {people?.map((person) => (
            <ExposureCard key={person.id} person={person} />
          ))}
        </div>
      )}

      {!isLoading && people.length === 0 && (
        <div className="text-center py-20 glass-card bg-bg-glass border-border-glass">
            <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">No Intelligence Records Found for these filters.</p>
        </div>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center items-center gap-6 mt-12 py-8 border-t border-border-glass">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 glass-card bg-bg-glass hover:bg-accent-blue/10 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Intelligence
          </button>
          <span className="text-[11px] font-black font-mono text-muted-foreground">SEC: {page} / {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 glass-card bg-bg-glass hover:bg-accent-blue/10 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next Intelligence <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
