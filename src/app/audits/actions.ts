"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getAudits() {
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
    .or('category.eq.TRC_INSTITUTIONAL_AUDIT,category.eq.LEGISLATION,category.eq.Corruption,title.ilike.%Audit%')
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((d: any) => {
    const meta = d.metadata || {};
    
    // Heuristics for mapping to the Audit UI
    let sector = "governance";
    if (d.title.toLowerCase().includes("prisons") || d.title.toLowerCase().includes("witness") || d.title.toLowerCase().includes("police")) {
      sector = "security";
    } else if (d.title.toLowerCase().includes("criminal") || d.title.toLowerCase().includes("procedure")) {
      sector = "judiciary";
    }

    let decay = 5.0;
    if (meta.risk_level === "CRITICAL" || d.title.toLowerCase().includes("forensic")) {
      decay = 9.2;
    } else if (d.title.toLowerCase().includes("reform") || d.title.toLowerCase().includes("zondo")) {
      decay = 7.5;
    }

    const violations = meta.violations || meta.vulnerabilities || meta.risk_areas || ["Institutional Decay"];

    return {
      id: d.id,
      name: meta.institution || d.title,
      sector: sector,
      decay: decay,
      status: d.status || (decay >= 8 ? "unreformed" : "partially_reformed"),
      violations: violations,
      echo: d.summary,
      desc: d.content
    };
  });
}
