"use client";

import { useState, useEffect, useMemo } from "react";
import { ExposureCard } from "@/components/ExposureCard";
import { offlineStorage } from "@/lib/offline-storage";
import { WifiOff, Search, Filter } from "lucide-react";

export default function ExposeClient({ initialPeople }: { initialPeople: any[] }) {
  const [people, setPeople] = useState(initialPeople);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");

  useEffect(() => {
    // 1. Save fresh data to offline storage
    if (initialPeople && initialPeople.length > 0 && offlineStorage) {
      const storage = offlineStorage;
      initialPeople.forEach(p => storage.saveDossier(p));
    }

    // 2. If initial load failed (empty or error), try to load from offline
    if ((!initialPeople || initialPeople.length === 0) && offlineStorage) {
      offlineStorage.getAllDossiers().then(cached => {
        if (cached && cached.length > 0) {
          setPeople(cached);
          setIsOfflineMode(true);
        }
      });
    }
  }, [initialPeople]);

  // Derived unique options for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    people.forEach(p => {
      const status = p.status || p.metadata?.status || p.metadata?.metadata?.status;
      if (status) statuses.add(status);
    });
    return Array.from(statuses).sort();
  }, [people]);

  // Filter Logic
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = person.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (person.role && person.role.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const personStatus = person.status || person.metadata?.status || person.metadata?.metadata?.status;
      const matchesStatus = statusFilter === "ALL" || personStatus === statusFilter;
      
      const matchesTier = tierFilter === "ALL" || 
                          (tierFilter === "PEP" && person.pep_tier) || 
                          (tierFilter === "NON-PEP" && !person.pep_tier);

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [people, searchQuery, statusFilter, tierFilter]);

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
      <div className="glass-card p-5 border-border-glass bg-bg-glass flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input 
            type="text" 
            placeholder="Search by name, role, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border-glass rounded-lg py-2.5 pl-10 pr-4 text-[12px] text-foreground focus:outline-none focus:border-accent-blue/50 transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-background border border-border-glass rounded-lg py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:border-accent-blue/50 transition-all min-w-[140px]"
            >
              <option value="ALL">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
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

      {/* Results HUD */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Showing {filteredPeople.length} Entities
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPeople?.map((person) => (
          <ExposureCard key={person.id} person={person} />
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-20 glass-card bg-bg-glass border-border-glass">
            <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">No Intelligence Records Found for these filters.</p>
        </div>
      )}
    </div>
  );
}
