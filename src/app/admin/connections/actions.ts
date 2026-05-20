"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getNodes() {
    const supabase = await createServerClient();
    
    const [peopleRes, orgsRes] = await Promise.all([
        supabase.from('people').select('id, full_name').order('full_name'),
        supabase.from('organizations').select('id, name').order('name')
    ]);

    return {
        people: peopleRes.data || [],
        orgs: orgsRes.data || []
    };
}

export async function getConnections() {
    const supabase = await createServerClient();
    
    const [personRelRes, personOrgRes] = await Promise.all([
        supabase.from('person_relationships').select('*, source_person:people!source_person_id(full_name), target_person:people!target_person_id(full_name)').order('created_at', { ascending: false }),
        supabase.from('person_org_links').select('*, people(full_name), organizations(name)').order('created_at', { ascending: false })
    ]);

    return {
        relationships: personRelRes.data || [],
        orgLinks: personOrgRes.data || []
    };
}

export async function createRelationship(data: any) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('person_relationships').insert({
        source_person_id: data.source_id,
        target_person_id: data.target_id,
        relationship_type: data.type,
        confidence: data.confidence,
        evidence_summary: data.evidence,
        source: 'ADMIN_MANUAL_ENTRY'
    });
    if (error) throw error;
    revalidatePath('/admin/connections');
    revalidatePath('/network');
}

export async function createOrgLink(data: any) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('person_org_links').insert({
        person_id: data.person_id,
        org_id: data.org_id,
        role: data.role,
        confidence: data.confidence,
        source: 'ADMIN_MANUAL_ENTRY'
    });
    if (error) throw error;
    revalidatePath('/admin/connections');
    revalidatePath('/network');
}

export async function deleteRelationship(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('person_relationships').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/connections');
    revalidatePath('/network');
}

export async function deleteOrgLink(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('person_org_links').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/connections');
    revalidatePath('/network');
}
