import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSyndicates() {
  console.log("Seeding syndicates...");

  // 1. Insert Organizations
  const { data: orgs, error: orgErr } = await supabase.from('organizations').insert([
    { name: 'Gold Mafia', type: 'syndicate', sector: 'Illicit Mining & Smuggling', risk_score: 90, description: 'Transnational illicit gold smuggling and money laundering network.' },
    { name: 'Cape Taxi Cartel', type: 'syndicate', sector: 'Extortion & Transport', risk_score: 85, description: 'Violent extortion and transport monopoly controlling major provincial routes.' }
  ]).select();

  if (orgErr || !orgs) {
    console.error("Error inserting orgs:", orgErr);
    return;
  }
  const goldMafiaId = orgs.find(o => o.name === 'Gold Mafia').id;
  const taxiCartelId = orgs.find(o => o.name === 'Cape Taxi Cartel').id;
  console.log("Inserted Orgs.");

  // 2. Insert People
  const { data: people, error: pErr } = await supabase.from('people').insert([
    // Gold Mafia
    { full_name: 'Simon Rudland', role: 'Financier', pep_tier: 3, risk_score: 95, type: 'syndicate_member' },
    { full_name: 'Ewan Macmillan', role: 'Smuggler', pep_tier: 3, risk_score: 88, type: 'syndicate_member' },
    { full_name: 'Kamlesh Pattni', role: 'Launderer', pep_tier: 3, risk_score: 92, type: 'syndicate_member' },
    
    // Taxi Mafia
    { full_name: 'Mandla Gcaba', role: 'Operations Chief', pep_tier: 2, risk_score: 89, type: 'syndicate_member' },
    { full_name: 'Sipho Zungu', role: 'Enforcer', pep_tier: 3, risk_score: 75, type: 'syndicate_member' },
    { full_name: 'Thabo Nqwelo', role: 'Route Manager', pep_tier: 3, risk_score: 70, type: 'syndicate_member' }
  ]).select();

  if (pErr || !people) {
    console.error("Error inserting people:", pErr);
    return;
  }
  
  const getPersonId = (name: string) => people.find(p => p.full_name === name).id;
  console.log("Inserted People.");

  // 3. Insert Person Org Links (Assigning Bosses)
  const { error: poErr } = await supabase.from('person_org_links').insert([
    { person_id: getPersonId('Simon Rudland'), org_id: goldMafiaId, role: 'Boss/Financier', confidence: 95 },
    { person_id: getPersonId('Mandla Gcaba'), org_id: taxiCartelId, role: 'Operations Boss', confidence: 90 }
  ]);

  if (poErr) console.error("Error inserting person_org_links:", poErr);
  else console.log("Inserted Person Org Links.");

  // 4. Insert Person Relationships (Linking Associates to Bosses)
  const { error: prErr } = await supabase.from('person_relationships').insert([
    // Gold Mafia Links
    { source_person_id: getPersonId('Ewan Macmillan'), target_person_id: getPersonId('Simon Rudland'), relationship_type: 'associate', confidence: 85 },
    { source_person_id: getPersonId('Kamlesh Pattni'), target_person_id: getPersonId('Simon Rudland'), relationship_type: 'associate', confidence: 90 },
    
    // Taxi Cartel Links
    { source_person_id: getPersonId('Sipho Zungu'), target_person_id: getPersonId('Mandla Gcaba'), relationship_type: 'associate', confidence: 80 },
    { source_person_id: getPersonId('Thabo Nqwelo'), target_person_id: getPersonId('Mandla Gcaba'), relationship_type: 'associate', confidence: 75 }
  ]);

  if (prErr) console.error("Error inserting person_relationships:", prErr);
  else console.log("Inserted Person Relationships.");

  console.log("Seeding complete.");
}

seedSyndicates();
