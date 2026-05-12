import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateNetwork() {
  console.log('🚀 Starting Network Link Population...');

  // 1. Create Core Organizations
  const orgs = [
    {
      name: 'Vlakplaas (C1/C10)',
      type: 'law_enforcement',
      sector: 'State Security',
      description: 'The counter-insurgency unit of the South African Police (SAPS) based at the Vlakplaas farm, notorious for death squads and human rights violations.',
      status: 'dissolved',
      risk_score: 9.8,
      metadata: { trc_reference: 'TRC Vol 2, Chapter 3' }
    },
    {
      name: 'Civil Cooperation Bureau (CCB)',
      type: 'military',
      sector: 'SADF Special Forces',
      description: 'A covert special forces unit of the South African Defence Force (SADF) that targeted anti-apartheid activists.',
      status: 'dissolved',
      risk_score: 9.5,
      metadata: { trc_reference: 'TRC Vol 2, Chapter 3' }
    },
    {
      name: 'SAPS Security Branch',
      type: 'law_enforcement',
      sector: 'Police',
      description: 'The intelligence and internal security division of the South African Police during apartheid.',
      status: 'dissolved',
      risk_score: 9.0,
      metadata: { trc_reference: 'TRC Vol 2' }
    }
  ];

  const { data: insertedOrgs, error: orgError } = await supabase
    .from('organizations')
    .upsert(orgs, { onConflict: 'name' })
    .select();

  if (orgError) {
    console.error('❌ Error inserting organizations:', orgError);
    return;
  }

  console.log(`✅ Inserted/Updated ${insertedOrgs.length} organizations.`);

  const vlakplaas = insertedOrgs.find(o => o.name.includes('Vlakplaas'));
  const ccb = insertedOrgs.find(o => o.name.includes('CCB'));
  const securityBranch = insertedOrgs.find(o => o.name.includes('Security Branch'));

  // 2. Link People to Organizations
  // Eugene de Kock (4f472ec5-a60c-4cfd-8365-2062811fa8c6) -> Vlakplaas
  // Dirk Coetzee (Search for him)
  
  const peopleToSearch = ['Eugene de Kock', 'Dirk Coetzee', 'Joe Mamasela', 'Craig Williamson', 'Magnus Malan', 'Wouter Basson'];
  const { data: foundPeople } = await supabase
    .from('people')
    .select('id, full_name')
    .in('full_name', peopleToSearch);

  console.log(`🔍 Found ${foundPeople?.length || 0} high-profile individuals in DB.`);

  const personOrgLinks = [];
  
  if (foundPeople) {
    const eugene = foundPeople.find(p => p.full_name.includes('Eugene de Kock'));
    if (eugene && vlakplaas) {
      personOrgLinks.push({
        person_id: eugene.id,
        org_id: vlakplaas.id,
        role: 'Commander',
        status: 'former',
        confidence: 100,
        source: 'TRC Vol 2'
      });
    }

    const dirk = foundPeople.find(p => p.full_name.includes('Dirk Coetzee'));
    if (dirk && vlakplaas) {
      personOrgLinks.push({
        person_id: dirk.id,
        org_id: vlakplaas.id,
        role: 'Founder/Commander',
        status: 'former',
        confidence: 100,
        source: 'TRC Vol 2'
      });
    }

    const craig = foundPeople.find(p => p.full_name.includes('Craig Williamson'));
    if (craig && securityBranch) {
      personOrgLinks.push({
        person_id: craig.id,
        org_id: securityBranch.id,
        role: 'Major',
        status: 'former',
        confidence: 100,
        source: 'TRC Vol 2'
      });
    }

    const magnus = foundPeople.find(p => p.full_name.includes('Magnus Malan'));
    if (magnus && securityBranch) {
      personOrgLinks.push({
        person_id: magnus.id,
        org_id: securityBranch.id,
        role: 'Oversight',
        status: 'former',
        confidence: 80,
        source: 'TRC Vol 2'
      });
    }
  }

  if (personOrgLinks.length > 0) {
    const { error: linkError } = await supabase
      .from('person_org_links')
      .upsert(personOrgLinks, { onConflict: 'person_id,org_id' });

    if (linkError) {
      console.error('❌ Error linking people to orgs:', linkError);
    } else {
      console.log(`✅ Created/Updated ${personOrgLinks.length} person-to-organization links.`);
    }
  }

  // 3. Create Inter-Person Relationships
  const relationships = [];
  const eugene = foundPeople?.find(p => p.full_name.includes('Eugene de Kock'));
  const dirk = foundPeople?.find(p => p.full_name.includes('Dirk Coetzee'));
  const magnus = foundPeople?.find(p => p.full_name.includes('Magnus Malan'));

  if (eugene && dirk) {
    relationships.push({
      source_person_id: eugene.id,
      target_person_id: dirk.id,
      relationship_type: 'associate',
      confidence: 90,
      evidence_summary: 'Successive commanders of the Vlakplaas death squad unit.',
      source: 'TRC Vol 2'
    });
  }

  if (eugene && magnus) {
    relationships.push({
      source_person_id: eugene.id,
      target_person_id: magnus.id,
      relationship_type: 'subordinate',
      confidence: 85,
      evidence_summary: 'Operational commander under state security oversight.',
      source: 'TRC Vol 2'
    });
  }

  if (relationships.length > 0) {
    const { error: relError } = await supabase
      .from('person_relationships')
      .upsert(relationships, { onConflict: 'source_person_id,target_person_id' });

    if (relError) {
      console.error('❌ Error creating relationships:', relError);
    } else {
      console.log(`✅ Created/Updated ${relationships.length} person-to-person relationships.`);
    }
  }

  console.log('🏁 Network population cycle complete.');
}

populateNetwork();
