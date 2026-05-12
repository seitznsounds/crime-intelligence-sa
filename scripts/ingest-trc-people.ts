import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestTRCPeople() {
  console.log('🚀 Ingesting key TRC figures into people table...');

  const people = [
    {
      full_name: 'Dirk Coetzee',
      role: 'SAPS Captain / Vlakplaas Founder',
      description: 'The first commander of the Vlakplaas counter-insurgency unit who later exposed the existence of police hit squads.',
      pep_tier: 3,
      risk_score: 8.5,
      metadata: { source: 'TRC Vol 2' }
    },
    {
      full_name: 'Joe Mamasela',
      role: 'SAPS Sergeant / Vlakplaas Operative',
      description: 'An askari and Vlakplaas operative involved in numerous human rights violations.',
      pep_tier: 3,
      risk_score: 9.0,
      metadata: { source: 'TRC Vol 2' }
    },
    {
      full_name: 'Craig Williamson',
      role: 'SAPS Major / Security Branch spy',
      description: 'A notorious apartheid spy and security branch officer involved in overseas assassinations.',
      pep_tier: 2,
      risk_score: 9.5,
      metadata: { source: 'TRC Vol 2' }
    },
    {
      full_name: 'Magnus Malan',
      role: 'Minister of Defence',
      description: 'The Minister of Defence during the height of the apartheid era and a key architect of the total strategy policy.',
      pep_tier: 1,
      risk_score: 9.2,
      metadata: { source: 'TRC Vol 2' }
    },
    {
      full_name: 'Wouter Basson',
      role: 'Head of Project Coast',
      description: 'Head of the apartheid-era secret chemical and biological warfare program.',
      pep_tier: 1,
      risk_score: 9.9,
      metadata: { source: 'TRC Vol 2' }
    }
  ];

  for (const person of people) {
    const { data: existing } = await supabase
      .from('people')
      .select('id')
      .eq('full_name', person.full_name)
      .maybeSingle();

    if (existing) {
      console.log(`ℹ️ Person ${person.full_name} already exists. Skipping.`);
      continue;
    }

    const { error } = await supabase
      .from('people')
      .insert(person);

    if (error) {
      console.error(`❌ Error inserting ${person.full_name}:`, error);
    } else {
      console.log(`✅ Ingested ${person.full_name}.`);
    }
  }
}

ingestTRCPeople();
