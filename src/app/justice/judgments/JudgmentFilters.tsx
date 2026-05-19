"use client";

import { Search, Filter, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const CRIME_CATEGORIES = [
  'Gang Violence',
  'Drug Trafficking',
  'Cash-in-Transit (CIT)',
  'Extortion',
  'Mass Shooting',
  'Kidnapping',
  'Vehicle Hijacking',
  'Corruption/Police Involvement',
  'Illegal Mining'
];

export default function JudgmentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("query", query);
    else params.delete("query");
    
    if (category) params.set("category", category);
    else params.delete("category");
    
    params.set("page", "1"); // Reset to page 1

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="glass-card p-6 border-border-glass bg-bg-glass flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[250px] space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Keywords</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Judge, case #, or keywords..."
            className="w-full pl-12 pr-4 py-3 bg-charcoal-3 border border-border-glass rounded-xl text-sm focus:border-accent-blue transition-all outline-none"
          />
        </div>
      </div>

      <div className="w-full sm:w-64 space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Crime Category</label>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-charcoal-3 border border-border-glass rounded-xl text-sm focus:border-accent-blue appearance-none transition-all outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {CRIME_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 h-[46px]">
        <button 
          onClick={handleSearch}
          disabled={isPending}
          className="px-8 bg-accent-blue text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-blue disabled:opacity-50"
        >
          Apply
        </button>
        {(query || category) && (
          <button 
            onClick={handleClear}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
            title="Clear Filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
