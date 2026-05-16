import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import natural from 'natural';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAllPeople() {
    let allPeople: any[] = [];
    let from = 0;
    let to = 999;
    let finished = false;

    while (!finished) {
        const { data, error } = await supabase
            .from('people')
            .select('id, full_name, risk_score, metadata')
            .range(from, to);

        if (error) break;
        if (data && data.length > 0) {
            allPeople = allPeople.concat(data);
            from += 1000;
            to += 1000;
        } else {
            finished = true;
        }
    }
    return allPeople;
}

async function resolveEntities() {
    console.log("Fetching all people for resolution...");
    const people = await getAllPeople();
    console.log(`Loaded ${people.length} people.`);

    const jaroWinkler = natural.JaroWinklerDistance;
    const resolved = new Set();
    const clusters: any[] = [];

    // Focus on high-risk people first or just sample for prototype
    // For 37k people, O(n^2) is too slow.
    // We'll use a simple heuristic: people with same starting letter or same word count.
    
    const groups: { [key: string]: any[] } = {};
    people.forEach(p => {
        const firstLetter = p.full_name?.trim().charAt(0).toUpperCase() || '?';
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(p);
    });

    console.log("Comparing entities within letter groups...");

    for (const letter in groups) {
        const group = groups[letter];
        if (group.length < 2) continue;

        for (let i = 0; i < group.length; i++) {
            const p1 = group[i];
            if (resolved.has(p1.id)) continue;

            for (let j = i + 1; j < group.length; j++) {
                const p2 = group[j];
                if (resolved.has(p2.id)) continue;

                const score = jaroWinkler(p1.full_name, p2.full_name);
                
                if (score > 0.95) {
                    console.log(`MATCH [${score.toFixed(3)}]: "${p1.full_name}" <-> "${p2.full_name}"`);
                    
                    // Logic: The one with the forensic_id in metadata or higher risk score wins
                    const p1Forensic = p1.metadata?.forensic_id;
                    const p2Forensic = p2.metadata?.forensic_id;
                    
                    let winner = p1;
                    let loser = p2;
                    
                    if (p2Forensic && !p1Forensic) {
                        winner = p2;
                        loser = p1;
                    } else if (p2.risk_score > p1.risk_score) {
                        winner = p2;
                        loser = p1;
                    }

                    resolved.add(loser.id);
                    clusters.push({ winner, loser, score });
                }
            }
        }
    }

    console.log(`\nFound ${clusters.length} high-confidence duplicates.`);

    // For the prototype, we'll perform the merge:
    // 1. Move relationships from loser to winner
    // 2. Move org links from loser to winner
    // 3. Delete loser
    
    console.log("Executing merges...");
    for (const cluster of clusters) {
        const { winner, loser } = cluster;
        
        // Update person_org_links
        await supabase.from('person_org_links').update({ person_id: winner.id }).eq('person_id', loser.id);
        
        // Update person_relationships (source)
        await supabase.from('person_relationships').update({ source_person_id: winner.id }).eq('source_person_id', loser.id);
        
        // Update person_relationships (target)
        await supabase.from('person_relationships').update({ target_person_id: winner.id }).eq('target_person_id', loser.id);
        
        // Update person_incident_links
        await supabase.from('person_incident_links').update({ person_id: winner.id }).eq('person_id', loser.id);

        // Delete loser
        await supabase.from('people').delete().eq('id', loser.id);
        
        process.stdout.write(`.`);
    }

    console.log("\nEntity Resolution Complete.");
}

resolveEntities();
