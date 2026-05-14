"use server";

import { triggerDeepResearch, getResearchStatus, getResearchResults } from "@/lib/apify-deep-research";
import { createServerClient } from "@/lib/supabase-server";

export async function startInvestigation(formData: FormData) {
  const query = formData.get("query") as string;
  const depth = parseInt(formData.get("depth") as string) || 1;

  if (!query) throw new Error("Query is required");

  // 1. Trigger the Actor
  const run = await triggerDeepResearch({
    query,
    recursiveDepth: depth,
    maxResults: 5,
    detailedAnalysis: true
  });

  // 2. Log the investigation in our database (optional, for history)
  const supabase = await createServerClient();
  await supabase.from("historical_records").insert({
    title: `Deep Research: ${query}`,
    content: `Investigation triggered. Run ID: ${run.id}`,
    source_url: `https://console.apify.com/runs/${run.id}`,
    category: "RESEARCH_LOG"
  });

  return { runId: run.id };
}

export async function checkInvestigationStatus(runId: string) {
  const status = await getResearchStatus(runId);
  return {
    status: status?.status,
    finishedAt: status?.finishedAt,
    progress: status?.status === "SUCCEEDED" ? 100 : status?.status === "RUNNING" ? 50 : 0
  };
}

export async function fetchInvestigationResults(runId: string) {
  const items = await getResearchResults(runId);
  return items;
}
