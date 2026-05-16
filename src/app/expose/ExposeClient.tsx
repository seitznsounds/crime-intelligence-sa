"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ExposureCard } from "@/components/ExposureCard";
import { offlineStorage } from "@/lib/offline-storage";
import { WifiOff, Search, Filter, ChevronLeft, ChevronRight, UserMinus, UserCheck, Skull } from "lucide-react";
import { getExposeData } from "./actions";

export default function ExposeClient({ 
  initialPeople, 
  initialTotalCount,
  uniqueStatuses 
}: { 
  initialPeople: any[], 
  initialTotalCount: number,
  uniqueStatuses: string[]
}) {
  const [people, setPeople] = useState(initialPeople);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
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
  }, [debouncedQuery, statusFilter, tierFilter, vitalStatusFilter, page]);

  useEffect(() => {
    // Skip first load if we have initial data and it's page 1 with no filters
    if (page === 1 && debouncedQuery === "" && statusFilter === "ALL" && tierFilter === "ALL" && vitalStatusFilter === "ALL") {
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

            {/* Tier Filter */}
            <div className="relative">
              <select 
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[120px]"
              >
                <option value="ALL">All Entities</option>
                <option value="PEP">PEP Only</option>
                <option value="NON-PEP">Non-PEP Only</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
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
