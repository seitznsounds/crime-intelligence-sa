import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Inserting Numbers Gang data...");

  // 1. Insert Organizations
  const organizations = [
    { name: 'Numbers Gang (26s, 27s, 28s)', type: 'syndicate', sector: 'Organized Crime', description: '100-year-old prison gang system originating in turn-of-the-century Johannesburg jails.' },
    { name: 'The 28s', type: 'syndicate', sector: 'Prison Gang', description: 'Organized around the "Rooiland" myth; divided into gold line (soldiers) and silver line (judicial/intellectual).' },
    { name: 'The 27s', type: 'syndicate', sector: 'Prison Gang', description: 'Guarantors of gang law and peacekeepers between the 26s and 28s.' },
    { name: 'The 26s', type: 'syndicate', sector: 'Prison Gang', description: 'Focuses on the accumulation of wealth through cunning, trickery, and smuggling.' }
  ];

  const { data: orgData, error: orgError } = await supabase.from('organizations').upsert(organizations, { onConflict: 'name' }).select();
  if (orgError) {
    console.error("Org Error:", orgError);
    return;
  }
  console.log("Organizations upserted.");

  // 2. Insert People (Check existence first)
  const peopleNames = ['Nongoloza Mathebula', 'Kilikijan'];
  const { data: existingPeople } = await supabase.from('people').select('*').in('full_name', peopleNames);
  
  const peopleToInsert = [
    { full_name: 'Nongoloza Mathebula', role: 'Founder', description: 'Historical founder of the Numbers Gang; early Johannesburg bandit.' },
    { full_name: 'Kilikijan', role: 'Co-Founder', description: 'Mythical co-founder of the Number; leader of the group that works by day.' }
  ].filter(p => !existingPeople?.some(e => e.full_name === p.full_name));

  let allPeople = existingPeople || [];
  if (peopleToInsert.length > 0) {
    const { data: insertedPeople, error: peopleError } = await supabase.from('people').insert(peopleToInsert).select();
    if (peopleError) {
      console.error("People Error:", peopleError);
    } else if (insertedPeople) {
      allPeople = [...allPeople, ...insertedPeople];
      console.log(`Inserted ${insertedPeople.length} new people.`);
    }
  } else {
    console.log("People already exist.");
  }

  // 3. Link People to Main Org
  const mainOrg = orgData.find(o => o.name === 'Numbers Gang (26s, 27s, 28s)');
  const nongoloza = allPeople.find(p => p.full_name === 'Nongoloza Mathebula');
  const kilikijan = allPeople.find(p => p.full_name === 'Kilikijan');

  if (mainOrg && nongoloza && kilikijan) {
    const personLinks = [
      { person_id: nongoloza.id, org_id: mainOrg.id, role: 'Founder', confidence: 100 },
      { person_id: kilikijan.id, org_id: mainOrg.id, role: 'Co-Founder', confidence: 90 }
    ];
    // Check link existence first
    const { data: existingLinks } = await supabase.from('person_org_links').select('*').eq('org_id', mainOrg.id);
    
    const linksToInsert = personLinks.filter(l => !existingLinks?.some(e => e.person_id === l.person_id));

    if (linksToInsert.length > 0) {
        const { error: plError } = await supabase.from('person_org_links').insert(linksToInsert);
        if (plError) console.error("Person Link Error:", plError);
        else console.log(`Inserted ${linksToInsert.length} new person links.`);
    } else {
        console.log("Person links already exist.");
    }
  }

  console.log("Data insertion complete.");
}

main();
