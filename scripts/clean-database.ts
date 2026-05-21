import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanDatabase() {
  console.log("Starting Database Sanitization...");
  
  // 1. Fetch all syndicates
  const { data: syndicates, error: syndErr } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('type', 'syndicate');

  if (syndErr) throw syndErr;

  let deletedSyndicates = 0;
  for (const s of syndicates || []) {
    let shouldDelete = false;
    
    // Check NLP artifact criteria
    const words = s.name.split(' ');
    if (words.length > 5 || 
        s.name.toLowerCase().includes('alleged') ||
        s.name.toLowerCase().includes('these') ||
        s.name.toLowerCase().includes('this') ||
        s.name.toLowerCase().includes('in addition') ||
        s.name.toLowerCase().includes('i do not') ||
        s.name.toLowerCase().includes('breaking news')) {
      shouldDelete = true;
    } else {
      // Check if empty
      const { count } = await supabase
        .from('person_org_links')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', s.id);
      
      if (count === 0) {
        shouldDelete = true;
      }
    }

    if (shouldDelete) {
      console.log(`Deleting junk syndicate: ${s.name}`);
      await supabase.from('organizations').delete().eq('id', s.id);
      deletedSyndicates++;
    }
  }

  console.log(`✅ Deleted ${deletedSyndicates} junk/empty syndicates.`);

  // 2. Fetch all people and sanitize
  // Due to limits, we paginate
  let page = 0;
  let deletedPeople = 0;
  let resetPeople = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: people, error: pplErr } = await supabase
      .from('people')
      .select('id, full_name, role, pep_tier, risk_score')
      .range(page * 1000, (page + 1) * 1000 - 1);

    if (pplErr) throw pplErr;
    if (!people || people.length === 0) {
      hasMore = false;
      break;
    }

    const idsToDelete: string[] = [];
    const idsToReset: string[] = [];

    for (const p of people) {
      const lowerName = p.full_name.toLowerCase();
      // Check NLP criteria for deletion
      if (lowerName.includes('year-old') || 
          lowerName.includes('child care') || 
          lowerName.includes('child support') || 
          lowerName.includes('childlike') || 
          lowerName.match(/^[0-9]+-year-old child$/) ||
          lowerName.match(/^[0-9]+-year-old woman$/) ||
          lowerName.match(/^[0-9]+-year-old man$/) ||
          lowerName === 'child' ||
          lowerName === 'woman' ||
          lowerName === 'man' ||
          lowerName === 'unidentified' ||
          lowerName === 'unknown') {
        idsToDelete.push(p.id);
        console.log(`Deleting NLP artifact person: ${p.full_name}`);
      } 
      // Check for unverified High Risk Demotion
      else if (!p.role && p.pep_tier === null && (p.risk_score || 0) >= 8) {
        idsToReset.push(p.id);
      }
    }

    if (idsToDelete.length > 0) {
      await supabase.from('people').delete().in('id', idsToDelete);
      deletedPeople += idsToDelete.length;
    }

    if (idsToReset.length > 0) {
      await supabase.from('people').update({ risk_score: 1.0 }).in('id', idsToReset);
      resetPeople += idsToReset.length;
    }

    page++;
  }

  console.log(`✅ Deleted ${deletedPeople} NLP artifact people.`);
  console.log(`✅ Demoted ${resetPeople} unverified high-risk people to 1.0 risk score.`);
  console.log("Database Sanitization Complete!");
}

cleanDatabase().catch(console.error);
