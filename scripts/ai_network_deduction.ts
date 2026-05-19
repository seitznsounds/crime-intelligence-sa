import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runNetworkDeduction() {
    console.log("🚀 Starting AI-Assisted Network Deduction Engine...");

    // 1. HEURISTIC: Legal Shield Overlap
    console.log("\n[Heuristic 1] Analyzing Legal Shield Overlap...");
    const { data: judgments } = await supabase
        .from('historical_records')
        .select('id, title, metadata')
        .eq('category', 'COURT_JUDGMENT');

    const attorneyToOrgs: Record<string, Set<string>> = {};
    const orgToName: Record<string, string> = {};

    // Get all syndicates to match against titles
    const { data: syndicates } = await supabase.from('organizations').select('id, name').eq('type', 'syndicate');
    syndicates?.forEach(s => orgToName[s.id] = s.name);

    judgments?.forEach(j => {
        const attorneys = j.metadata?.['Legal Representation'] || j.metadata?.['Legal Rep'] || [];
        if (!Array.isArray(attorneys)) return;

        // Find which syndicate this case belongs to (fuzzy title match)
        const linkedOrg = syndicates?.find(s => j.title.toLowerCase().includes(s.name.toLowerCase()));
        if (!linkedOrg) return;

        attorneys.forEach((attorney: string) => {
            if (!attorneyToOrgs[attorney]) attorneyToOrgs[attorney] = new Set();
            attorneyToOrgs[attorney].add(linkedOrg.id);
        });
    });

    let legalDeductions = 0;
    for (const [attorney, orgIds] of Object.entries(attorneyToOrgs)) {
        if (orgIds.size > 1) {
            const ids = Array.from(orgIds);
            console.log(`  -> Shared Counsel Detected: ${attorney} represents ${ids.length} syndicates.`);
            
            // Infer links between these syndicates
            for (let i = 0; i < ids.length; i++) {
                for (let j = i + 1; j < ids.length; j++) {
                    await insertInferredLink(ids[i], ids[j], `INFERRED: Shared Legal Counsel (${attorney})`, 75);
                    legalDeductions++;
                }
            }
        }
    }

    // 2. HEURISTIC: Transitive Relationship Inference
    console.log("\n[Heuristic 2] Analyzing Transitive Syndicate Links...");
    
    // Get all people linked to syndicates
    const { data: personOrgs } = await supabase
        .from('person_org_links')
        .select('person_id, org_id, organizations!inner(type)')
        .eq('organizations.type', 'syndicate');

    const personToSyndicate: Record<string, string> = {};
    personOrgs?.forEach(po => personToSyndicate[po.person_id] = po.org_id);

    // Get all person-to-person relationships
    const { data: relationships } = await supabase
        .from('person_relationships')
        .select('source_person_id, target_person_id, relationship_type');

    let transitiveDeductions = 0;
    if (relationships) {
        for (const rel of relationships) {
            const orgA = personToSyndicate[rel.source_person_id];
            const orgB = personToSyndicate[rel.target_person_id];

            if (orgA && orgB && orgA !== orgB) {
                console.log(`  -> Transitive Alliance: Syndicates ${orgToName[orgA]} and ${orgToName[orgB]} linked via individual relationship.`);
                await insertInferredLink(orgA, orgB, `INFERRED: Transitive Alliance (${rel.relationship_type})`, 65);
                transitiveDeductions++;
            }
        }
    }
    
    // 3. HEURISTIC: Operational M.O. Overlap
    console.log("\n[Heuristic 3] Analyzing Operational M.O. Overlap...");
    const { data: incidents } = await supabase
        .from('incidents')
        .select('id, modus_operandi, syndicate_link')
        .not('modus_operandi', 'is', null)
        .not('syndicate_link', 'is', null);

    const moClusters: Record<string, string[]> = {};
    const STOP_WORDS = new Set(['the', 'and', 'with', 'used', 'from', 'into', 'that', 'this', 'was', 'were', 'their', 'they', 'have', 'been']);

    incidents?.forEach(inc => {
        const words = inc.modus_operandi.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
            .split(/\s+/)
            .filter(w => w.length > 5 && !STOP_WORDS.has(w));
        
        words.forEach(w => {
            if (!moClusters[w]) moClusters[w] = [];
            moClusters[w].push(inc.syndicate_link);
        });
    });

    let moDeductions = 0;
    for (const [word, syndicateIds] of Object.entries(moClusters)) {
        const uniqueSyndicates = Array.from(new Set(syndicateIds));
        if (uniqueSyndicates.length > 1 && uniqueSyndicates.length < 4) {
            console.log(`  -> MO Signature "${word}" connects ${uniqueSyndicates.length} syndicates.`);
            for (let i = 0; i < uniqueSyndicates.length; i++) {
                for (let j = i + 1; j < uniqueSyndicates.length; j++) {
                    await insertInferredLink(uniqueSyndicates[i], uniqueSyndicates[j], `INFERRED: Shared MO Signature ("${word}")`, 60);
                    moDeductions++;
                }
            }
        }
    }

    console.log(`\n✅ Network Deduction Engine Session Finished.`);
    console.log(`Summary:`);
    console.log(`- Legal Deductions: ${legalDeductions}`);
    console.log(`- Transitive Deductions: ${transitiveDeductions}`);
    console.log(`- MO Deductions: ${moDeductions}`);
}

async function insertInferredLink(sourceId: string, targetId: string, relType: string, confidence: number) {
    const { data: org } = await supabase.from('organizations').select('metadata').eq('id', sourceId).single();
    const metadata = org?.metadata || {};
    const inferred = metadata.inferred_connections || [];
    
    if (!inferred.some((c: any) => c.target === targetId)) {
        inferred.push({
            target: targetId,
            type: relType,
            confidence: confidence,
            deduced_at: new Date().toISOString()
        });
        await supabase.from('organizations').update({
            metadata: { ...metadata, inferred_connections: inferred }
        }).eq('id', sourceId);
    }
}

runNetworkDeduction().catch(console.error);
