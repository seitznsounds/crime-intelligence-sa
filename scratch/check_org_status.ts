import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrgStatus() {
  const { data, error } = await supabase
    .from('organizations')
    .select('status');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const statuses = Array.from(new Set(data?.map(d => d.status)));
  console.log('Unique statuses:', statuses);
}

checkOrgStatus();
