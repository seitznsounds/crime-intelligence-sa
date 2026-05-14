import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getRelationships() {
  const { data, error } = await supabase
    .from('person_relationships')
    .select('*, person1:person1_id(full_name), person2:person2_id(full_name)');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Relationships found:', data?.length);
  console.log(JSON.stringify(data, null, 2));
}

getRelationships();
