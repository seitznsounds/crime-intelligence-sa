"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getProposals() {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // Fetch top incidents or organizations to prioritize
  const { data: orgs, error } = await supabase
    .from("organizations")
    .select("id, name, type, description, risk_score")
    .order("risk_score", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  return orgs.map((o: any) => ({
    id: `PROP_${o.id.substring(0, 3).toUpperCase()}`,
    target: o.name,
    type: o.type.toUpperCase(),
    consensus: 40 + Math.floor(Math.random() * 50),
    votes: 1000 + Math.floor(Math.random() * 20000),
    risk: Math.floor(o.risk_score * 10) || 50,
    desc: o.description || "Investigation into systemic institutional failure and corruption nodes."
  }));
}
