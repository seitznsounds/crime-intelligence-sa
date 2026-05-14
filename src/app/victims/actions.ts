"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getVictims() {
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
    .from("people")
    .select("*")
    .eq("type", "Victim")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((v: any) => ({
    id: v.id,
    name: v.full_name,
    date: v.metadata?.date_of_death || v.date_of_death || "Unknown Date",
    violation: v.metadata?.cause_of_death || v.cause_of_death || v.role || "Gross Violation",
    location: v.address || "South Africa",
    desc: v.description || v.metadata?.summary || "No detailed description available."
  }));
}
