
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDistribution() {
  const { data, error } = await supabase
    .from('person_org_links')
    .select('confidence');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const counts: Record<number, number> = {};
  data.forEach(row => {
    const val = row.confidence;
    counts[val] = (counts[val] || 0) + 1;
  });

  console.log('Confidence value distribution:', counts);
}

checkDistribution();
