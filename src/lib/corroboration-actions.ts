"use server";

import { createServerClient } from "./supabase-server";

export async function submitCorroboration(data: {
  targetId: string;
  narrative: string;
  assets?: any[];
}) {
  const supabase = await createServerClient();

  // Create a record in historical_records or a specialized corroborate table
  // For now, we'll store it as a CITIZEN_REPORT in historical_records
  const { data: report, error } = await supabase.from('historical_records').insert({
    title: `Citizen Corroboration: ${data.targetId.substring(0, 8)}`,
    content: data.narrative,
    category: 'CITIZEN_REPORT',
    tags: ['corroboration', 'whistleblower'],
    metadata: {
        linked_record: data.targetId,
        source: 'Citizen Portal',
        security: 'ZKP_SIGNED'
    }
  }).select().single();

  if (error) throw error;

  // Link back to the original record
  // We need to fetch the original first to avoid overwriting all metadata
  const { data: original } = await supabase
    .from('historical_records')
    .select('metadata')
    .eq('id', data.targetId)
    .single();

  if (original) {
      const existingCorrobs = original.metadata?.citizen_corroborations || [];
      await supabase.from('historical_records').update({
          metadata: {
              ...original.metadata,
              citizen_corroborations: [...existingCorrobs, report.id]
          }
      }).eq('id', data.targetId);
  }

  return { success: true, reportId: report.id };
}
