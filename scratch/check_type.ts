
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkType() {
  // Querying information_schema through a common RPC if it exists, 
  // or just getting a sample row and checking the type of the value.
  const { data, error } = await supabase
    .from('person_org_links')
    .select('confidence')
    .not('confidence', 'is', null)
    .limit(5);

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Sample confidence values:', data);
    console.log('Type of first value:', typeof data[0].confidence);
  } else {
    console.log('No data found in person_org_links with non-null confidence');
  }
}

checkType();
