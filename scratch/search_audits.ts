import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function searchAudits() {
  const { data, error } = await supabase
    .from('historical_records')
    .select('*')
    .ilike('title', '%Audit%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Audits found:', data?.length);
  if (data) {
    data.forEach(d => console.log(`- ${d.title}`));
  }
}

searchAudits();
