import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function searchVol4() {
  const { data, error } = await supabase
    .from('historical_records')
    .select('*')
    .eq('source_type', 'trc_report')
    .ilike('summary', '%Volume 4%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Vol 4 records found:', data?.length);
  if (data) {
    data.forEach(d => console.log(`- ${d.title}`));
  }
}

searchVol4();
