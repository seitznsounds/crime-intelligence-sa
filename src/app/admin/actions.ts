"use server";

import { createServerClient } from "@/lib/supabase-server";

// Consolidated server actions for the Investigation Hub


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

export async function getInvestigationData() {
    const supabase = await createServerClient();
    
    const [stats, pendingReports] = await Promise.all([
        getAdminStats(),
        supabase.from('citizen_reports').select('*', { count: 'exact' }).eq('status', 'pending').order('created_at', { ascending: false }).limit(1)
    ]);

    return {
        stats,
        pendingCount: pendingReports.count || 0
    };
}

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { people: [], orgs: [], dossiers: [] };
    
    const supabase = await createServerClient();
    
    const [people, orgs, dossiers] = await Promise.all([
        supabase.from('people').select('id, full_name, risk_score, pep_tier, role').ilike('full_name', `%${query}%`).limit(5),
        supabase.from('organizations').select('id, name, threat_level, sector').eq('type', 'syndicate').ilike('name', `%${query}%`).limit(5),
        supabase.from('historical_records').select('id, title, updated_at').eq('category', 'DOSSIER').ilike('title', `%${query}%`).limit(5)
    ]);

    return {
        people: people.data || [],
        orgs: orgs.data || [],
        dossiers: dossiers.data || []
    };
}
