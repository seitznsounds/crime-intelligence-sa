"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getPeople(query?: string, page = 1, pageSize = 20) {
    const supabase = await createServerClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = supabase
        .from('people')
        .select('*', { count: 'exact' });

    if (query) {
        q = q.ilike('full_name', `%${query}%`);
    }

    const { data, count, error } = await q
        .order('full_name', { ascending: true })
        .range(from, to);

    if (error) throw error;
    return { data: data || [], total: count || 0 };
}

export async function upsertPerson(id: string | null, data: any) {
    const supabase = await createServerClient();
    
    const payload = {
        full_name: data.full_name,
        role: data.role,
        pep_tier: data.pep_tier,
        risk_score: data.risk_score,
        description: data.description,
        status: data.status || 'active',
        metadata: data.metadata || {},
        updated_at: new Date().toISOString()
    };

    if (id) {
        const { error } = await supabase
            .from('people')
            .update(payload)
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('people')
            .insert({
                ...payload,
                created_at: new Date().toISOString()
            });
        if (error) throw error;
    }

    revalidatePath('/admin/people');
    revalidatePath('/network');
    revalidatePath('/expose');
}

export async function deletePerson(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/people');
}
