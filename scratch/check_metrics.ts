import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMetricsTable() {
  const { data, error } = await supabase
    .from('reporting_metrics')
    .select('*')
    .limit(1);

  if (error) {
    console.log('reporting_metrics does not exist or error:', error.message);
  } else {
    console.log('reporting_metrics exists, rows:', data.length);
  }
}

checkMetricsTable();
