import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkWPU() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .ilike('name', '%Witness Protection%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('WPU Orgs found:', data?.length);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkWPU();
