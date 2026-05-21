"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

import { PERSON_CATEGORIES, ORG_CATEGORIES, CATEGORY_WEIGHTS } from "./constants";


export interface ReportPayload {
    reporter_hash: string;
    target_name: string;
    target_type: string;
    category: string;
    description: string;
    // Optional enrichment intel
    known_affiliates?: string;
    known_vehicles?: string;
    known_businesses?: string;
    known_locations?: string;
}

export async function submitCitizenReport(payload: ReportPayload) {
    const supabase = await createServerClient();

    // Combine the enrichment intel into the description for storage
    const enrichmentParts: string[] = [];
    if (payload.known_affiliates) enrichmentParts.push(`KNOWN AFFILIATES: ${payload.known_affiliates}`);
    if (payload.known_vehicles) enrichmentParts.push(`KNOWN VEHICLES: ${payload.known_vehicles}`);
    if (payload.known_businesses) enrichmentParts.push(`KNOWN BUSINESSES: ${payload.known_businesses}`);
    if (payload.known_locations) enrichmentParts.push(`KNOWN LOCATIONS: ${payload.known_locations}`);
    const fullDescription = [payload.description, ...enrichmentParts].filter(Boolean).join('\n\n');

    // 1. Insert or update the report
    const { error: reportErr } = await supabase
        .from("citizen_reports")
        .upsert(
            {
                reporter_hash: payload.reporter_hash,
                target_name: payload.target_name,
                target_type: payload.target_type,
                category: payload.category,
                description: fullDescription,
                created_at: new Date().toISOString()
            },
            { onConflict: "reporter_hash, target_name" }
        );

    if (reportErr) {
        console.error("Report Insert Error:", reportErr);
        throw new Error("Failed to secure report.");
    }

    return { success: true };
}
