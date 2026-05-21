"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getSyndicates() {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from('organizations')
        .select(`
            *,
            person_org_links(
                role,
                people(
                    id, full_name, risk_score, pep_tier,
                    person_incident_links(
                        role,
                        incidents(id, title, type)
                    )
                )
            )
        `)
        .eq('type', 'syndicate')
        .order('name', { ascending: true });
        
    // Also fetch assets manually per syndicate since Supabase RPC might be needed for polymorphic joins,
    // or we can fetch all asset links and map them.
    const { data: assetLinks } = await supabase
        .from('entity_asset_links')
        .select(`
            owner_id, link_type, confidence_score,
            assets(id, asset_type, identifier, name_or_description, estimated_value, status)
        `)
        .eq('owner_type', 'organization');

    if (data && assetLinks) {
        data.forEach(org => {
            org.assets = assetLinks.filter(al => al.owner_id === org.id).map(al => ({
                link_type: al.link_type,
                confidence_score: al.confidence_score,
                ...al.assets
            }));
        });
    }

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

export async function addAssetToSyndicate(orgId: string, assetData: any) {
    const supabase = await createServerClient();
    
    // 1. Create the Asset
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

    // 2. Link to Syndicate
    const { error: linkErr } = await supabase
        .from('entity_asset_links')
        .insert({
            asset_id: asset.id,
            owner_type: 'organization',
            owner_id: orgId,
            link_type: assetData.link_type || 'operational_use'
        });

    if (linkErr) throw linkErr;

    revalidatePath('/admin/syndicates');
}

export async function searchPeople(query: string) {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from('people')
        .select('id, full_name, risk_score, pep_tier')
        .ilike('full_name', `%${query}%`)
        .limit(10);
    return data || [];
}

export async function addMemberToSyndicate(orgId: string, personId: string, role: string) {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from('person_org_links')
        .upsert({
            person_id: personId,
            org_id: orgId,
            role: role || 'Associate',
            status: 'active'
        }, { onConflict: 'person_id, org_id' });
        
    if (error) throw error;
    revalidatePath('/admin/syndicates');
}
