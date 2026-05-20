"use server";

import { createServerClient } from "@/lib/supabase-server";

export async function getAdminStats() {
    const supabase = await createServerClient();
    
    const [dossiers, orgs, people] = await Promise.all([
        supabase.from('historical_records').select('id', { count: 'exact', head: true }).eq('category', 'DOSSIER'),
        supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('type', 'syndicate'),
        supabase.from('people').select('id', { count: 'exact', head: true })
    ]);

    return {
        dossiers: dossiers.count || 0,
        syndicates: orgs.count || 0,
        entities: people.count || 0,
        health: "98%"
    };
}
