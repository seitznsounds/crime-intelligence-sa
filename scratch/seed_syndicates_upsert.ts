import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSyndicates() {
  console.log("Seeding syndicates (Upsert mode)...");

  // 1. Fetch Organizations
  const { data: orgs, error: orgErr } = await supabase.from('organizations').select('id, name');

  if (orgErr || !orgs) {
    console.error("Error fetching orgs:", orgErr);
    return;
  }
  const goldMafiaId = orgs.find(o => o.name === 'Gold Mafia')?.id;
  const taxiCartelId = orgs.find(o => o.name === 'Cape Taxi Cartel')?.id;
  console.log("Fetched Orgs.", goldMafiaId, taxiCartelId);

  // 2. Fetch People
  const { data: people, error: pErr } = await supabase.from('people').select('id, full_name');

  if (pErr || !people) {
    console.error("Error fetching people:", pErr);
    return;
  }
  
  const getPersonId = (name: string) => people.find(p => p.full_name === name)?.id;
  console.log("Fetched People.");

  // Check if person relationships exist to avoid duplicate key violations if any
  // But we know it failed at person_relationships earlier.
  // 4. Insert Person Relationships (Linking Associates to Bosses)
  const prData = [
    // Gold Mafia Links
    { source_person_id: getPersonId('Ewan Macmillan'), target_person_id: getPersonId('Simon Rudland'), relationship_type: 'associate', confidence: 85 },
    { source_person_id: getPersonId('Kamlesh Pattni'), target_person_id: getPersonId('Simon Rudland'), relationship_type: 'associate', confidence: 90 },
    
    // Taxi Cartel Links
    { source_person_id: getPersonId('Sipho Zungu'), target_person_id: getPersonId('Mandla Gcaba'), relationship_type: 'associate', confidence: 80 },
    { source_person_id: getPersonId('Thabo Nqwelo'), target_person_id: getPersonId('Mandla Gcaba'), relationship_type: 'associate', confidence: 75 }
  ];

  console.log("Relationships to insert:", prData);

  const { error: prErr } = await supabase.from('person_relationships').upsert(prData, { onConflict: 'source_person_id,target_person_id,relationship_type' });

  if (prErr) console.error("Error inserting person_relationships:", prErr);
  else console.log("Upserted Person Relationships.");

  console.log("Seeding complete.");
}

seedSyndicates();
