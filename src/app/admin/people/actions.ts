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

    if (data && data.length > 0) {
        const personIds = data.map(p => p.id);
        const { data: assetLinks } = await supabase
            .from('entity_asset_links')
            .select(`
                owner_id, link_type, confidence_score,
                assets(id, asset_type, identifier, name_or_description, estimated_value, status)
            `)
            .eq('owner_type', 'person')
            .in('owner_id', personIds);

        data.forEach(p => {
            p.assets = assetLinks?.filter(al => al.owner_id === p.id).map(al => ({
                link_type: al.link_type,
                confidence_score: al.confidence_score,
                ...(al.assets as any)
            })) || [];
        });
    }

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

export async function addAssetToPerson(personId: string, assetData: any) {
    const supabase = await createServerClient();
    
    const { data: asset, error: assetErr } = await supabase
        .from('assets')
        .insert({
            asset_type: assetData.asset_type,
            identifier: assetData.identifier,
            name_or_description: assetData.name_or_description,
            estimated_value: assetData.estimated_value,
            status: assetData.status || 'active'
        })
        .select()
        .single();
        
    if (assetErr) throw assetErr;

    const { error: linkErr } = await supabase
        .from('entity_asset_links')
        .insert({
            asset_id: asset.id,
            owner_type: 'person',
            owner_id: personId,
            link_type: assetData.link_type || 'beneficial_owner'
        });

    if (linkErr) throw linkErr;

    revalidatePath('/admin/people');
}
