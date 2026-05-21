"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { CATEGORY_WEIGHTS } from "@/app/report/constants";

export async function getPendingReports() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("citizen_reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function approveCitizenReport(reportId: string, mappedTargetName: string) {
    const supabase = await createServerClient();

    // 1. Fetch the report
    const { data: report, error: reportErr } = await supabase
        .from("citizen_reports")
        .select("*")
        .eq("id", reportId)
        .single();

    if (reportErr || !report) throw reportErr || new Error("Report not found");

    // 2. Count unique corroborated reports for this target
    const { count, error: countErr } = await supabase
        .from("citizen_reports")
        .select("*", { count: "exact", head: true })
        .eq("target_name", mappedTargetName)
        .eq("status", "approved");

    if (countErr) throw countErr;
    const uniqueReports = (count || 0) + 1; // +1 for the one we are approving

    // 3. Calculate Risk Score
    const weight = CATEGORY_WEIGHTS[report.category] || { base: 20, increment: 5 };
    const calculatedRisk = Math.min(100, weight.base + weight.increment * (uniqueReports - 1));

    // 4. Register or Escalate Target based on target_type
    if (report.target_type === "person") {
        const { data: existingPerson } = await supabase
            .from("people")
            .select("id, risk_score, description")
            .ilike("full_name", mappedTargetName)
            .maybeSingle();

        if (existingPerson) {
            const newRisk = Math.max(existingPerson.risk_score || 0, calculatedRisk);
            const newDesc = existingPerson.description 
                ? `${existingPerson.description}\n\n[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n${report.description}`
                : `[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n${report.description}`;

            await supabase
                .from("people")
                .update({
                    risk_score: newRisk,
                    description: newDesc
                })
                .eq("id", existingPerson.id);
        } else {
            await supabase.from("people").insert({
                full_name: mappedTargetName,
                status: "suspected",
                risk_score: calculatedRisk,
                description: `[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n\n${report.description}`,
                role: "Suspected Individual",
                pep_tier: 0
            });
        }
    } else if (report.target_type === "organization") {
        const { data: existingOrg } = await supabase
            .from("organizations")
            .select("id, threat_level, description")
            .ilike("name", mappedTargetName)
            .maybeSingle();

        if (existingOrg) {
            const newRisk = Math.max(existingOrg.threat_level || 0, calculatedRisk);
            const newDesc = existingOrg.description 
                ? `${existingOrg.description}\n\n[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n${report.description}`
                : `[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n${report.description}`;

            await supabase
                .from("organizations")
                .update({
                    threat_level: newRisk,
                    description: newDesc
                })
                .eq("id", existingOrg.id);
        } else {
            await supabase.from("organizations").insert({
                name: mappedTargetName,
                type: "syndicate",
                threat_level: calculatedRisk,
                description: `[ADMIN VERIFIED] Citizen Intelligence: ${uniqueReports} corroborated report(s) [${report.category}].\n\n${report.description}`
            });
        }
    }

    // 5. Update Report Status
    await supabase
        .from("citizen_reports")
        .update({ status: 'approved' })
        .eq("id", reportId);

    revalidatePath("/admin/reports");
    revalidatePath("/admin/people");
    revalidatePath("/admin/syndicates");
    revalidatePath("/expose");

    return { success: true };
}

export async function rejectCitizenReport(reportId: string, rejectionReason: string) {
    const supabase = await createServerClient();
    await supabase
        .from("citizen_reports")
        .update({ status: 'rejected', rejection_reason: rejectionReason })
        .eq("id", reportId);

    revalidatePath("/admin/reports");
    return { success: true };
}
