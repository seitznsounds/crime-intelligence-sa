"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getAmnestyApplications() {
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
    .from("amnesty_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((a: any) => ({
    id: a.id,
    name: a.applicant_name,
    group: a.affiliation || "Unknown",
    decision: a.decision?.toLowerCase() || "pending",
    disclosure: a.full_disclosure || false,
    motive: a.political_objective || "Not specified",
    crime: a.crime_details || "No details available",
    hearing: a.hearing_location || "Unknown"
  }));
}
