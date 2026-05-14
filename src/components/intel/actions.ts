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

export async function getDonationStats() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('donations')
    .select('amount')
    .eq('purpose', 'project')
    .eq('status', 'success');

  if (error) {
    console.error("Error fetching donations:", error);
    return { totalZar: 0, count: 0 };
  }

  const totalCents = data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  
  return {
    totalZar: totalCents / 100,
    count: data?.length || 0
  };
}

import { runDeepResearch } from '@/lib/apify-deep-research';

export async function performDeepResearch(query: string, maxResults = 3) {
  // Optional: Add authorization check here if needed
  return await runDeepResearch(query, maxResults);
}

export async function getInferredLinks() {
  const supabase = await createServerClient();

  // 1. Find High Probability Hubs (High risk score + some links)
  const { data: hubs, error: hubError } = await supabase
    .from('people')
    .select('id, full_name, risk_score, description')
    .gt('risk_score', 80)
    .order('risk_score', { ascending: false })
    .limit(5);

  if (hubError || !hubs) return [];

  const allPredictions: any[] = [];

  for (const hub of hubs) {
    // 2. Graph Analysis: Shared Associates
    const { data: associates } = await supabase
      .from('person_relationships')
      .select('target_person_id')
      .eq('source_person_id', hub.id);

    const associateIds = associates?.map((a: any) => a.target_person_id) || [];
    
    let graphPredictions: any[] = [];
    if (associateIds.length > 0) {
      const { data: shared } = await supabase
        .from('person_relationships')
        .select('source_person_id, target_person_id')
        .in('target_person_id', associateIds)
        .neq('source_person_id', hub.id)
        .limit(3);
      
      if (shared) {
        for (const s of shared) {
          const { data: p } = await supabase.from('people').select('full_name').eq('id', s.source_person_id).single();
          if (p) {
            graphPredictions.push({
              id: s.source_person_id,
              name: p.full_name,
              score: 75 + Math.random() * 10,
              type: 'Graph',
              reason: `Shared associate identified in forensic relationship graph.`
            });
          }
        }
      }
    }

    // 3. AI Inference: Semantic Similarity
    // Get representative vector for hub
    const { data: kbEntries } = await supabase
      .from('ai_knowledge_base')
      .select('embedding')
      .ilike('content', `%${hub.full_name}%`)
      .limit(1);

    let semanticPredictions: any[] = [];
    if (kbEntries && kbEntries[0]) {
      const { data: similar } = await supabase.rpc('search_knowledge_base', {
        query_embedding: kbEntries[0].embedding,
        match_threshold: 0.82,
        match_count: 5
      });

      if (similar) {
        // Extract names from similar docs
        const { data: allPeople } = await supabase.from('people').select('id, full_name').neq('id', hub.id);
        if (allPeople) {
          for (const simDoc of similar) {
            for (const person of allPeople) {
              if (simDoc.content.includes(person.full_name)) {
                semanticPredictions.push({
                  id: person.id,
                  name: person.full_name,
                  score: Math.round(simDoc.similarity * 100),
                  type: 'AI Inference',
                  reason: `High semantic correlation in ${simDoc.metadata?.title || 'investigative report'}.`
                });
                break;
              }
            }
          }
        }
      }
    }

    allPredictions.push({
      hubName: hub.full_name,
      predictions: [...graphPredictions, ...semanticPredictions].slice(0, 3)
    });
  }

  return allPredictions;
}

