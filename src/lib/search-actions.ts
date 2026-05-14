"use server";

import { createServerClient } from "@/lib/supabase-server";

export async function searchIntelligence(query: string) {
  if (!query || query.length < 3) return [];
  
  const supabase = await createServerClient();
  
  // Fallback to direct text search if RPC fails
  const { data, error } = await supabase
    .from('historical_records')
    .select('*')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data.map(d => ({
    id: d.id,
    label: d.title,
    category: d.category || "Historical",
    href: d.category === 'TRC_INSTITUTIONAL_AUDIT' ? `/audits?id=${d.id}` : `/vault?id=${d.id}`
  }));
}

export async function searchPeople(query: string) {
  if (!query || query.length < 3) return [];
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .ilike('full_name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error("People search error:", error);
    return [];
  }

  return data.map(p => ({
    id: p.id,
    label: p.full_name,
    category: p.type || "Person",
    href: `/expose?id=${p.id}`
  }));
}
