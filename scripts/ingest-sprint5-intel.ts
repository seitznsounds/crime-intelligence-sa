import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestSprint5Intel() {
  console.log('🚀 Starting Sprint 5 Knowledge Graph Expansion (Safe Mode)...');

  // 1. Ingest Organizations (Upsert works here)
  const orgs = [
    { name: 'Big Five Cartel', type: 'syndicate', sector: 'Organized Crime', description: 'Sophisticated syndicate that has infiltrated SAPS Crime Intelligence and SCM. Involved in gold, drugs, and tender fraud.', status: 'under_investigation', risk_score: 10.0 },
    { name: 'Medicare 24', type: 'company', sector: 'Healthcare', description: 'Private health company involved in R360m tender fraud with SAPS SCM.', status: 'under_investigation', risk_score: 8.5 },
    { name: 'SAPS Crime Intelligence', type: 'law_enforcement', sector: 'Intelligence', description: 'The intelligence division of the South African Police Service, currently facing severe institutional decay and infiltration.', status: 'active', risk_score: 7.5 },
    { name: 'Political Killings Task Team (PKTT)', type: 'law_enforcement', sector: 'Specialized Policing', description: 'SAPS task team accused of factional weaponization and malicious prosecution of political rivals.', status: 'under_investigation', risk_score: 8.0 },
    { name: 'National Anti-Corruption Advisory Council (NACAC)', type: 'government', sector: 'Oversight', description: 'Body established to advise the President on the implementation of the National Anti-Corruption Strategy.', status: 'active', risk_score: 3.0 },
    { name: 'Office of Public Integrity (OPI)', type: 'government', sector: 'Anti-Corruption', description: 'Proposed Chapter 9 institution intended to centralize anti-corruption efforts and absorb SIU resources.', status: 'active', risk_score: 2.0 },
    { name: 'Whistleblower Support Platform for Reform (WSPR)', type: 'government', sector: 'Civil Society', description: 'Multi-stakeholder platform co-creating whistleblower support measures and training.', status: 'active', risk_score: 1.0 },
    { name: 'Asset Forfeiture Unit (AFU)', type: 'government', sector: 'Prosecution', description: 'NPA unit responsible for seizing assets derived from criminal activities.', status: 'active', risk_score: 4.0 }
  ];

  for (const org of orgs) {
    const { error } = await supabase.from('organizations').upsert(org, { onConflict: 'name' });
    if (error) console.error(`❌ Org Error (${org.name}):`, error.message);
    else console.log(`✅ Org: ${org.name}`);
  }

  // 2. Ingest People (Manual Check)
  const people = [
    { full_name: 'Cyril Ramaphosa', role: 'President of South Africa', pep_tier: 1, risk_score: 7.0, status: 'Under Impeachment Inquiry' },
    { full_name: 'Arthur Fraser', role: 'Former SSA Head', pep_tier: 1, risk_score: 9.0 },
    { full_name: 'Feroz Khan', role: 'SAPS Major General', pep_tier: 2, risk_score: 9.8, status: 'Arrested' },
    { full_name: 'Fannie Masemola', role: 'National Police Commissioner', pep_tier: 2, risk_score: 6.5, status: 'Active (Under Investigation)' },
    { full_name: 'Cat Matlala', role: 'Former SAPS Head of SCM', pep_tier: 2, risk_score: 9.5, status: 'Arrested' },
    { full_name: 'Fadiel Adams', role: 'Member of Parliament', pep_tier: 1, risk_score: 4.0, status: 'Arrested' },
    { full_name: 'Raymond Zondo', role: 'Chief Justice', pep_tier: 1, risk_score: 1.0 },
    { full_name: 'Firoz Cachalia', role: 'Chairperson of NACAC', pep_tier: 2, risk_score: 1.5 }
  ];

  for (const person of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', person.full_name).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('people').update(person).eq('id', existing.id);
      if (error) console.error(`❌ Person Update Error (${person.full_name}):`, error.message);
      else console.log(`✅ Person Updated: ${person.full_name}`);
    } else {
      const { error } = await supabase.from('people').insert(person);
      if (error) console.error(`❌ Person Insert Error (${person.full_name}):`, error.message);
      else console.log(`✅ Person Inserted: ${person.full_name}`);
    }
  }

  // 3. Ingest Incidents (Manual Check)
  const incidents = [
    { title: 'Constitutional Court Phala Phala Judgment', summary: 'Judicial intervention mandating impeachment inquiry into President Cyril Ramaphosa.', crime_category: 'Corruption', severity: 'Critical', status: 'active' },
    { title: 'Arrest of SAPS Intelligence Generals', summary: 'Dismantling of senior SAPS leadership linked to the Big Five Cartel.', crime_category: 'Organized Crime', severity: 'Critical', status: 'under_investigation' },
    { title: 'Medicare 24 Tender Fraud', summary: 'R360 million fraudulent contract leading to 12 arrests.', crime_category: 'Procurement Fraud', severity: 'High', status: 'under_investigation' }
  ];

  for (const incident of incidents) {
    const { data: existing } = await supabase.from('incidents').select('id').eq('title', incident.title).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('incidents').update(incident).eq('id', existing.id);
      if (error) console.error(`❌ Incident Update Error (${incident.title}):`, error.message);
      else console.log(`✅ Incident Updated: ${incident.title}`);
    } else {
      const { error } = await supabase.from('incidents').insert(incident);
      if (error) console.error(`❌ Incident Insert Error (${incident.title}):`, error.message);
      else console.log(`✅ Incident Inserted: ${incident.title}`);
    }
  }

  console.log('🏁 Sprint 5 Ingestion Cycle Complete.');
}

ingestSprint5Intel().catch(console.error);
