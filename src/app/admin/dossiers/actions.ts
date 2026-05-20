"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getDossiers() {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from('historical_records')
        .select('*')
        .eq('category', 'DOSSIER')
        .order('created_at', { ascending: false });
    return data || [];
}

export async function saveDossier(id: string | null, data: any) {
    const supabase = await createServerClient();
    
    if (id) {
        const { error } = await supabase
            .from('historical_records')
            .update({
                title: data.title,
                content: data.content,
                metadata: data.metadata,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('historical_records')
            .insert({
                category: 'DOSSIER',
                title: data.title,
                content: data.content,
                metadata: {
                    ...data.metadata,
                    is_deep_dossier: true
                },
                event_date: new Date().toISOString()
            });
        if (error) throw error;
    }

    revalidatePath('/admin/dossiers');
    revalidatePath('/network');
}

export async function deleteDossier(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('historical_records').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/dossiers');
}
