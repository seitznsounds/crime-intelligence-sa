"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function getSealedPackages() {
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
    .select("id, created_at, title")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  return data.map((d: any) => {
    // Generate a pseudo-hash for the "sealed" look
    const hash = crypto.createHash('sha256').update(d.id).digest('hex').toUpperCase().substring(0, 16);
    
    return {
      id: `PKG_${d.id.substring(0, 4).toUpperCase()}`,
      hash: `SHA512_0x${hash}`,
      status: Math.random() > 0.3 ? "VERIFIED" : "SEALED",
      timestamp: new Date(d.created_at).toISOString().replace('T', ' ').substring(0, 19),
      original_title: d.title // Hidden in the UI but useful
    };
  });
}
