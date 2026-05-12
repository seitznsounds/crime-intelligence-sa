import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function linkForeignShells() {
  console.log('🚀 Starting Foreign Shell Network Expansion...');

  // 1. Create Foreign Shell Organizations
  const shells = [
    {
      name: 'Global Alpha Shell Ltd',
      type: 'company',
      sector: 'International Finance',
      description: 'UK-based shell entity identified in the AFU-UK-001 asset recovery case. Leveraged for illicit gold and drug proceeds.',
      status: 'active',
      risk_score: 9.2,
      metadata: { jurisdiction: 'United Kingdom', case_ref: 'AFU-UK-001', estimated_value: 125000000 }
    },
    {
      name: 'Dubai Sovereign Assets',
      type: 'company',
      sector: 'Real Estate',
      description: 'UAE-based holding used for the purchase of luxury properties using diverted public funds.',
      status: 'active',
      risk_score: 9.5,
      metadata: { jurisdiction: 'UAE (Dubai)', case_ref: 'AFU-UAE-002', estimated_value: 450000000 }
    },
    {
      name: 'Swiss Integrity Holding',
      type: 'company',
      sector: 'Private Banking',
      description: 'Swiss-based entity identified as a repository for diverted sovereign wealth fund assets.',
      status: 'active',
      risk_score: 8.8,
      metadata: { jurisdiction: 'Switzerland', case_ref: 'AFU-CH-003', estimated_value: 890000000 }
    }
  ];

  const { data: insertedShells, error: shellError } = await supabase
    .from('organizations')
    .upsert(shells, { onConflict: 'name' })
    .select();

  if (shellError) {
    console.error('❌ Error inserting shells:', shellError);
    return;
  }

  console.log(`✅ Inserted/Updated ${insertedShells.length} foreign shell organizations.`);

  // 2. Link People to Shells
  const peopleToSearch = ['Feroz Khan', 'General Fannie Masemola', 'Molefe Fani', 'Ebrahim Kadwa'];
  const { data: foundPeople } = await supabase
    .from('people')
    .select('id, full_name')
    .in('full_name', peopleToSearch);

  console.log(`🔍 Found ${foundPeople?.length || 0} PEPs/Suspects in DB.`);

  const personOrgLinks = [];

  if (foundPeople) {
    const feroz = foundPeople.find(p => p.full_name.includes('Feroz Khan'));
    const alphaShell = insertedShells.find(o => o.name.includes('Global Alpha Shell'));
    if (feroz && alphaShell) {
      personOrgLinks.push({
        person_id: feroz.id,
        org_id: alphaShell.id,
        role: 'Beneficial Owner',
        status: 'active',
        confidence: 95,
        source: 'AFU-UK-001 Forensic Audit'
      });
    }

    const masemola = foundPeople.find(p => p.full_name.includes('Fannie Masemola'));
    const dubaiShell = insertedShells.find(o => o.name.includes('Dubai Sovereign Assets'));
    if (masemola && dubaiShell) {
      personOrgLinks.push({
        person_id: masemola.id,
        org_id: dubaiShell.id,
        role: 'Intermediary Control',
        status: 'active',
        confidence: 85,
        source: 'AFU-UAE-002 Link Analysis'
      });
    }

    const fani = foundPeople.find(p => p.full_name.includes('Molefe Fani'));
    const swissShell = insertedShells.find(o => o.name.includes('Swiss Integrity Holding'));
    if (fani && swissShell) {
      personOrgLinks.push({
        person_id: fani.id,
        org_id: swissShell.id,
        role: 'Signatory',
        status: 'active',
        confidence: 90,
        source: 'AFU-CH-003 Swiss Audit'
      });
    }

    const kadwa = foundPeople.find(p => p.full_name.includes('Ebrahim Kadwa'));
    if (kadwa && alphaShell) {
      personOrgLinks.push({
        person_id: kadwa.id,
        org_id: alphaShell.id,
        role: 'Facilitator',
        status: 'active',
        confidence: 80,
        source: 'Precious Metals Case Investigation'
      });
    }
  }

  if (personOrgLinks.length > 0) {
    const { error: linkError } = await supabase
      .from('person_org_links')
      .upsert(personOrgLinks, { onConflict: 'person_id,org_id' });

    if (linkError) {
      console.error('❌ Error linking people to shells:', linkError);
    } else {
      console.log(`✅ Created/Updated ${personOrgLinks.length} person-to-shell links.`);
    }
  }

  console.log('🏁 Foreign Shell Expansion cycle complete.');
}

linkForeignShells();
