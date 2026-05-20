"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getSyndicates() {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('type', 'syndicate')
        .order('name', { ascending: true });
    return data || [];
}

export async function upsertSyndicate(id: string | null, data: any) {
    const supabase = await createServerClient();
    
    if (id) {
        const { error } = await supabase
            .from('organizations')
            .update({
                name: data.name,
                sector: data.sector,
                headquarters: data.headquarters,
                description: data.description,
                risk_score: data.risk_score,
                metadata: data.metadata,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('organizations')
            .insert({
                type: 'syndicate',
                name: data.name,
                sector: data.sector,
                headquarters: data.headquarters,
                description: data.description,
                risk_score: data.risk_score,
                metadata: data.metadata,
                status: 'active'
            });
        if (error) throw error;
    }

    revalidatePath('/admin/syndicates');
    revalidatePath('/syndicates');
}

export async function deleteSyndicate(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('organizations').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/syndicates');
}
