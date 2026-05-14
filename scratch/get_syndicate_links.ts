import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getSyndicateLinks() {
  const syndicateId = 'a979995f-de71-4658-9455-7ad059adb332';
  
  const { data, error } = await supabase
    .from('person_org_links')
    .select('*, people(*)')
    .eq('org_id', syndicateId);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Links found:', data?.length);
  console.log(JSON.stringify(data, null, 2));
}

getSyndicateLinks();
