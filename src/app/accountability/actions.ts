"use server";

import { createServerClient } from "@/lib/supabase-server";
import { triggerHistoricalBackfill } from "@/lib/apify-rag";
import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";

export async function triggerVolumeBackfill(volumeNumber: number) {
  let supabase;
  
  try {
    supabase = await createServerClient();
  } catch (e) {
    // Fallback for non-Next.js environments (like scripts)
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

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

    try {
      revalidatePath("/accountability");
    } catch (e) {
      // Ignore if called outside of Next.js context
    }
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
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  const { data, error } = await supabase
    .from("trc_volumes")
    .select("*")
    .order("volume_number", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
