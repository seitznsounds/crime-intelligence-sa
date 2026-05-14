"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function packageEvidence({
  title,
  recipient,
  classification,
  itemIds,
}: {
  title: string;
  recipient: string;
  classification: string;
  itemIds: { type: string; id: string }[];
}) {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // 1. Aggregate Data
  const aggregatedData: any = {
    metadata: {
      generated_at: new Date().toISOString(),
      recipient,
      classification,
      investigative_unit: "Google Antigravity // Crime Intelligence SA",
    },
    intelligence: [],
  };

  for (const item of itemIds) {
    const table = item.type === "person" ? "people" : 
                  item.type === "incident" ? "incidents" : 
                  item.type === "org" ? "organizations" : "historical_records";
    
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", item.id)
      .single();

    if (data) {
      aggregatedData.intelligence.push({
        type: item.type,
        id: item.id,
        payload: data,
      });
    }
  }

  // 2. Create Dossier Content (Markdown/JSON)
  const content = JSON.stringify(aggregatedData);

  // 3. Generate Cryptographic Signature
  const signature = crypto
    .createHash("sha256")
    .update(content + process.env.SUPABASE_SERVICE_ROLE_KEY) // Pseudo-signing
    .digest("hex");

  // 4. Store as Evidence Package
  const { data: pkg, error: insertError } = await supabase
    .from("historical_records")
    .insert([
      {
        title: `[JUSTICE_PACKAGE] ${title}`,
        summary: `Formal intelligence dossier prepared for ${recipient}. Classification: ${classification}.`,
        content: content,
        category: "EVIDENCE_PACKAGE",
        metadata: {
          recipient,
          classification,
          signature,
          item_count: itemIds.length,
          status: "SEALED",
        },
      },
    ])
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/vault");
  return pkg;
}

export async function getEvidencePackages() {
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
        .from("historical_records")
        .select("*")
        .eq("category", "EVIDENCE_PACKAGE")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((d: any) => ({
        id: d.id,
        title: d.title.replace("[JUSTICE_PACKAGE] ", ""),
        recipient: d.metadata?.recipient,
        classification: d.metadata?.classification,
        timestamp: d.created_at,
        signature: d.metadata?.signature,
        itemCount: d.metadata?.item_count,
        status: d.metadata?.status || "SEALED"
    }));
}
