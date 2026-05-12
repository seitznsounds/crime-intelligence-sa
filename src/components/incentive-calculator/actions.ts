"use server";

import { createClient } from "@/lib/supabase-server";

export async function getRecoveryTargets() {
  const supabase = await createClient();

  const { data: targets, error } = await supabase
    .from('organizations')
    .select('id, name, type, risk_score, metadata')
    .not('metadata', 'is', null);

  if (error) {
    console.error("Error fetching recovery targets:", error);
    return [];
  }

  return targets
    .filter(t => t.metadata?.case_ref || t.metadata?.estimated_value)
    .map(t => ({
      id: t.id,
      name: t.name,
      caseRef: t.metadata?.case_ref || "N/A",
      value: t.metadata?.estimated_value || 5000000, // Default 5M if not specified
      riskScore: t.risk_score || 0.5
    }));
}
