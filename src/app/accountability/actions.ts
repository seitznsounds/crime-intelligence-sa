"use server";

import { createServerClient } from "@/lib/supabase-server";
import { triggerHistoricalBackfill } from "@/lib/apify-rag";
import { revalidatePath } from "next/cache";

export async function triggerVolumeBackfill(volumeNumber: number) {
  const supabase = await createServerClient();

  // 1. Update status to INDEXING
  const { error: updateError } = await supabase
    .from("trc_volumes")
    .update({ status: "INDEXING", progress: 0 })
    .eq("volume_number", volumeNumber);

  if (updateError) throw new Error(`Failed to update volume status: ${updateError.message}`);

  // 2. Trigger Apify RAG
  const queries = [
    `South Africa TRC Report Volume ${volumeNumber}`,
    `Truth and Reconciliation Commission findings Volume ${volumeNumber}`,
  ];

  try {
    const run = await triggerHistoricalBackfill({
      queries,
      maxPagesPerQuery: 5,
      depth: 1,
    });

    // 3. Store run ID
    await supabase
      .from("trc_volumes")
      .update({ apify_run_id: run.id, progress: 10 })
      .eq("volume_number", volumeNumber);

    revalidatePath("/accountability");
    return { success: true, runId: run.id };
  } catch (error: any) {
    console.error("Backfill error:", error);
    await supabase
      .from("trc_volumes")
      .update({ status: "QUEUED", progress: 0 })
      .eq("volume_number", volumeNumber);
    return { success: false, error: error.message };
  }
}

export async function getTrcVolumes() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("trc_volumes")
    .select("*")
    .order("volume_number", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
