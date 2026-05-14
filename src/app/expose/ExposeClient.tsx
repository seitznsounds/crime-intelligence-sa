"use client";

import { useState, useEffect } from "react";
import { ExposureCard } from "@/components/ExposureCard";
import { offlineStorage } from "@/lib/offline-storage";
import { WifiOff } from "lucide-react";

export default function ExposeClient({ initialPeople }: { initialPeople: any[] }) {
  const [people, setPeople] = useState(initialPeople);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

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

  return (
    <div className="space-y-6">
      {isOfflineMode && (
        <div className="flex items-center gap-3 p-4 bg-accent-crimson/10 border border-accent-crimson/20 rounded-2xl mb-8 animate-fade-in">
          <WifiOff className="w-5 h-5 text-accent-crimson" />
          <div>
            <p className="text-[12px] font-black uppercase tracking-widest text-accent-crimson">Offline Mode Active</p>
            <p className="text-[11px] text-accent-crimson/60 font-medium">Displaying locally cached intelligence from your last successful uplink.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {people?.map((person) => (
          <ExposureCard key={person.id} person={person} />
        ))}
      </div>

      {people.length === 0 && (
        <div className="text-center py-20">
            <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">No Intelligence Cached Locally</p>
        </div>
      )}
    </div>
  );
}
