"use server";

import { createServerClient } from "@/lib/supabase-server";

export async function getReformData() {
  const supabase = await createServerClient();

  // Fetching records that are identified as reforms or legislative changes
  const { data: records, error } = await supabase
    .from('historical_records')
    .select('*')
    .or('category.ilike.%reform%,category.ilike.%legislation%,category.ilike.%legal%,title.ilike.%reform%,summary.ilike.%reform%')
    .order('event_date', { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching reform data:", error);
    return [];
  }

  return records.map(record => {
    // Mapping internal metadata to UI pillars
    const pillarMap: Record<string, string> = {
      "whistleblower_protection": "Whistleblower Protection",
      "institutional_reform": "Institutional Architecture",
      "legal_framework": "Legislative Reform",
      "legal_liability": "Accountability",
      "corruption_typology": "Transparency"
    };

    const category = record.category?.toLowerCase() || "";
    const metaPillar = record.metadata?.pillar_name || record.metadata?.pillar;
    
    return {
      pillar: pillarMap[category] || metaPillar || "Systemic Reform",
      reform: record.title,
      status: record.metadata?.status || "INGESTED",
      source: record.metadata?.source_file || record.metadata?.source || "NACS 2025",
      progress: record.metadata?.progress || (record.category === 'Legislation' ? 100 : 45),
      description: record.summary,
      date: record.event_date
    };
  });
}
