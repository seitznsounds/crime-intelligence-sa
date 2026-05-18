"use server";

import { createServerClient } from "./supabase-server";

export async function fetchRecentIntelligence() {
  const supabase = await createServerClient();
  
  // Fetch latest 5 judgments
  const { data: judgments } = await supabase
    .from('historical_records')
    .select('*')
    .eq('category', 'COURT_JUDGMENT')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch latest 5 crime incidents from news
  const { data: news } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    judgments: judgments || [],
    news: news || []
  };
}

export async function fetchAllJudgments(page = 1, pageSize = 20) {
    const supabase = await createServerClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
        .from('historical_records')
        .select('*', { count: 'exact' })
        .eq('category', 'COURT_JUDGMENT')
        .order('event_date', { ascending: false })
        .range(from, to);

    return { data: data || [], total: count || 0, error };
}

export async function fetchLegalHeatmap() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('historical_records')
        .select('metadata')
        .eq('category', 'COURT_JUDGMENT');

    if (error) return { data: [], error };

    const distribution: Record<string, number> = {};
    data.forEach(j => {
        const court = j.metadata?.['Court'] || 'Unknown';
        distribution[court] = (distribution[court] || 0) + 1;
    });

    const formattedData = Object.entries(distribution).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value);

    return { data: formattedData, error: null };
}
