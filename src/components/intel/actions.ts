"use server";

import { createServerClient } from "@/lib/supabase-server";

export async function getReformData() {
  const supabase = await createServerClient();

  // Fetching records that are identified as reforms or legislative changes
  const { data: records, error } = await supabase
    .from('historical_records')
    .select('*')
    .or('category.ilike.%reform%,category.ilike.%legislation%,category.ilike.%legal%,title.ilike.%reform%,summary.ilike.%reform%')
    .order('created_at', { ascending: false })
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
      date: record.event_date || record.created_at
    };
  });
}

export async function getOversightMetrics() {
  const supabase = await createServerClient();
  
  // 1. Get WPU data
  const { data: wpu } = await supabase
    .from('organizations')
    .select('*')
    .eq('name', 'Witness Protection Unit (WPU)')
    .single();

  // 2. Sample some stats (in a real app, these would be aggregated from multiple tables)
  // For now we map them from verified intelligence points in INGEST.md
  return [
    { label: "IPID Corruption", value: "+20%", status: "UPWARD", icon: "ShieldCheck", color: "text-accent-crimson" },
    { label: "SABRIC Digital Fraud", value: "+86%", status: "SURGE", icon: "Activity", color: "text-accent-crimson" },
    { label: "OPI Transition", value: "3 Year", status: "VACUUM", icon: "AlertCircle", color: "text-accent-gold" },
    { label: "WPU Vacancy", value: wpu?.metadata?.vacancy_rate || "40%", status: "DEFICIT", icon: "Ban", color: "text-accent-crimson" }
  ];
}

export async function getWpuData() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('name', 'Witness Protection Unit (WPU)')
    .single();

  if (error) {
    console.error("Error fetching WPU data:", error);
    return null;
  }

  return {
    vacancy_rate: data.metadata?.vacancy_rate || "0%",
    funding_deficit: data.metadata?.funding_deficit || "R 0",
    protection_paradox: data.metadata?.protection_paradox || "No paradox identified.",
    zondo_alignment: data.metadata?.zondo_alignment || "0%",
    risk_score: data.risk_score || 0,
    status: data.status || "active"
  };
}

export async function getAccountabilityKpis() {
  // Mapping from National Treasury Non-Compliance Report (INGEST.md)
  return {
    unpaid_invoices_total: "R 12.4 Bn",
    eastern_cape_failure: "R 3.8 Bn",
    doj_share: "49%",
    provincial_share: "97%",
    reporting_void: "11%", // Awareness vs Testimony gap (NORM-2025-002)
    fear_multiplier: "62%"
  };
}
