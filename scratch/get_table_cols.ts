import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getCols() {
  const table = process.argv[2] || 'people';
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (!error && data && data.length > 0) {
      console.log(`Columns for ${table}:`, Object.keys(data[0]));
  } else if (error) {
      console.log(`Error for ${table}:`, error.message);
  } else {
      console.log(`No data for ${table}.`);
  }
}

getCols();
