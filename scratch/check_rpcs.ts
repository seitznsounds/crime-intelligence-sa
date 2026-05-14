import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRPCs() {
  // Test search_intelligence
  const { data: intel, error: intelError } = await supabase.rpc('search_intelligence', { query: 'SAPS' });
  if (intelError) {
    console.error('search_intelligence error:', intelError.message);
  } else {
    console.log('search_intelligence results:', intel?.length);
  }

  // Test search_people_fuzzy
  const { data: people, error: peopleError } = await supabase.rpc('search_people_fuzzy', { name_query: 'Mandela' });
  if (peopleError) {
    console.error('search_people_fuzzy error:', peopleError.message);
  } else {
    console.log('search_people_fuzzy results:', people?.length);
  }
}

checkRPCs();
